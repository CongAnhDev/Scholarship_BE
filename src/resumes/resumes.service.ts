import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { Resume, ResumeDocument } from './schemas/resume.schemas';
import { Provider } from 'src/provider/schemas/providers.schemas';
import { User } from 'src/users/schemas/user.schema'; // Add this import
import { Types } from 'mongoose'; // Add this import
import { MailerService } from '@nestjs-modules/mailer';

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
      urlCV, email, scholarship,
      userId: _id,
      status: "PENDING",
      createdBy: { _id, email },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ]
    })

    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }



  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("not found resume")
    }
    return await this.resumeModel.findById(id);
  }


  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("not found resume")
    }

    const updated = await this.resumeModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      });

    return updated;
  }

  async findByUsers(user: IUser) {
    return await this.resumeModel.find({
      userId: user._id,
    })
      .sort("-createdAt")
      .populate([
        {
          path: "scholarship",
          select: { name: 1 }
        }
      ])
  }


  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException("not found resume")

    await this.resumeModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        },
      })
    return this.resumeModel.softDelete({
      _id
    });
  }
}


