import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Provider } from 'src/provider/schemas/providers.schemas';
import { User } from 'src/users/schemas/user.schema'; // Add this import
import { IUser } from 'src/users/users.interface';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { Resume, ResumeDocument, ResumeStatus } from './schemas/resume.schemas';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
    @InjectModel(Provider.name)
    private providerModel: mongoose.Model<Provider>,
    @InjectModel(User.name) // Add this line
    private userModel: mongoose.Model<User>, // Add this line
    private readonly mailerService: MailerService,
  ) { }

  // async searchByProviderName(providerName: string) {
  //   // Step 1: Query the provider by name
  //   const provider = await this.providerModel.findOne({ name: new RegExp(`^${providerName}$`, 'i') });

  //   // Check if provider is found
  //   if (!provider) {
  //     throw new BadRequestException("Provider not found");
  //   }

  //   // Step 2: Query resumes based on the provider's ID
  //   const resumes = await this.resumeModel.find({
  //     provider: provider._id
  //   }).exec();

  //   return resumes;
  // }

  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { urlCV, scholarship } = createUserCvDto;
    const { email, _id } = user;

    const newCV = await this.resumeModel.create({
      urlCV,
      email,
      scholarship,
      userId: _id,
      status: ResumeStatus.PENDING,
      orderCode: this.generateOrderCode(),
      createdBy: { _id, email },
      history: [
        {
          status: ResumeStatus.PENDING,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
    });

    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt,
      orderCode: newCV?.orderCode,
    };
  }

  generateOrderCode(): number {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return parseInt(`${year}${month}${day}${hour}${minute}${second}`);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort({ createdAt: -1 })
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found resume');
    }
    return await this.resumeModel
      .findById(id)
      .populate('scholarship', 'name quantity');
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('not found resume');
    }

    const updated = await this.resumeModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );

    return updated;
  }

  async findByUsers(user: IUser) {
    return await this.resumeModel
      .find({
        userId: user._id,
      })
      .sort('-createdAt')
      .populate([
        {
          path: 'scholarship',
          select: { name: 1 },
        },
      ]);
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException('not found resume');

    await this.resumeModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.resumeModel.softDelete({
      _id,
    });
  }

  async updateStatusByOrderCode(
    orderCode: number,
    status: keyof typeof ResumeStatus,
    user?: IUser,
  ) {
    const currentResume = await this.resumeModel.findOne({ orderCode }).exec();
    if (!currentResume) {
      throw new BadRequestException('Resume not found');
    }
    if (currentResume.status === status) {
      throw new BadRequestException('Status is the same');
    }

    return await this.resumeModel.updateOne(
      { orderCode },
      {
        $set: { status: status },
        $push: {
          history: {
            status: status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user?._id ?? 'system',
              email: user?.email ?? 'system@SFMS.com',
            },
          },
        },
      },
    );
  }
}
