import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResumePro, ResumeProDocument } from './schemas/resume-prov.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/users/schemas/user.schema';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';
import { CreateUserCvProDto } from './dto/create-resume-prov.dto';
import aqp from 'api-query-params';
import { MailService } from 'src/mail/mail.service';
import { ExcelService } from 'src/excel/excel.service';
import { IExcel } from 'src/excel/excel.interface';

@Injectable()
export class ResumeProvService {
  constructor(
    @InjectModel(ResumePro.name)
    private resumeProModel: SoftDeleteModel<ResumeProDocument>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private readonly excelService: ExcelService,
    private readonly mailService: MailService,
  ) { }

  async create(createUserCvProDto: CreateUserCvProDto, user: IUser) {
    const { urlCV, scholarProv, provider } = createUserCvProDto;
    const { name, email, _id } = user;

    const newCV = await this.resumeProModel.create({
      urlCV,
      email,
      name,
      note: '',
      scholarProv,
      provider,
      userId: _id,
      status: 'Đang chờ duyệt',
      createdBy: { _id, email },
      history: [
        {
          status: 'Đang chờ duyệt',
          note: '',
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
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    // Query tổng số bản ghi
    const totalItems = await this.resumeProModel.countDocuments(filter);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Thực hiện query học bổng
    const result = await this.resumeProModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort({ createdAt: -1 })
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, // Trang hiện tại
        pageSize: limit, // Số bản ghi mỗi trang
        pages: totalPages, // Tổng số trang
        total: totalItems, // Tổng số bản ghi
      },
      result, // Kết quả trả về
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found resume');
    }
    return (await this.resumeProModel.findById(id)).populate([
      {
        path: 'scholarProv',
        select: { name: 1 },
      },
      {
        path: 'provider',
        select: { name: 1 },
      },
    ]);
  }

  async update(_id: string, status: string, note: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('not found resume');
    }

    const updated = await this.resumeProModel.updateOne(
      { _id },
      {
        status,
        note,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status: status,
            note: note,
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

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException('not found resume');

    await this.resumeProModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.resumeProModel.softDelete({
      _id,
    });
  }

  async findByUsers(user: IUser) {
    return await this.resumeProModel
      .find({
        userId: user._id,
      })
      .sort('-createdAt')
      .populate([
        {
          path: 'scholarProv',
          select: { name: 1 },
        },
      ]);
  }

  async export(currentPage: number, limit: number, qs: string) {
    const { filter, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    // Query tổng số bản ghi
    const totalItems = await this.resumeProModel.countDocuments(filter);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Thực hiện query học bổng
    const result = await this.resumeProModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort({ createdAt: -1 })
      .populate(population)
      .select(projection as any)
      .exec();

    if (
      result.length > 0 &&
      ['Lịch phỏng vấn', 'Hồ sơ thành công'].includes(filter.status)
    ) {
      // generate excel file
      const payload: IExcel[] = result.map((it) => ({
        name: it.name,
        email: it.email,
        cvUrl: it.urlCV,
        phone: (it.userId as any).phone,
        school: (it.provider as any).name,
        scholarship: (it.scholarProv as any).name,
        createdAt: it.createdAt as any,
        note: it.note,
      }));
      await this.excelService.generateFile(payload, filter.status);

      // send mail
      if (filter.status === 'Lịch phỏng vấn') {
        await Promise.all(
          payload.map((it) =>
            this.mailService.sendInterviewInvitationLetter({
              name: it.name,
              providerName: it.school,
              scholarshipName: it.scholarship,
              receiverEmail: it.email,
              timeAndAddress: it.note,
            }),
          ),
        );
      } else {
        await Promise.all(
          payload.map((it) =>
            this.mailService.sendAdmissionLetter({
              name: it.name,
              providerName: it.school,
              scholarshipName: it.scholarship,
              receiverEmail: it.email,
              note: it.note,
            }),
          ),
        );
      }
    }

    return {
      meta: {
        current: currentPage, // Trang hiện tại
        pageSize: limit, // Số bản ghi mỗi trang
        pages: totalPages, // Tổng số trang
        total: totalItems, // Tổng số bản ghi
      },
      result, // Kết quả trả về
    };
  }
}
