import { Injectable } from '@nestjs/common';
import { CreateScholarProvDto } from './dto/create-scholar-prov.dto';
import { UpdateScholarProvDto } from './dto/update-scholar-prov.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ScholarProv, ScholarProvDocument } from './schemas/scholar-prov.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Provider } from 'src/provider/schemas/providers.schemas';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema'; // Add this import
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class ScholarProvService {
  constructor(
    @InjectModel(ScholarProv.name)
    private scholarProvModule: SoftDeleteModel<ScholarProvDocument>,
    @InjectModel(Provider.name)
    private providerModel: mongoose.Model<Provider>,
    @InjectModel(User.name) // Add this line
    private userModel: mongoose.Model<User> // Add this line
  ) { }

  async create(createScholarProvDto: CreateScholarProvDto, user: IUser) {
    const {
      name, provider, level, quantity, major, location, image, ielts, GPA, pay, value,
      description, isActive
    } = createScholarProvDto;

    let newScholarship = await this.scholarProvModule.create({
      name, provider, level, quantity, major, location, image, ielts, GPA, pay, value,
      description, isActive,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return {
      _id: newScholarship?._id,
      createdAt: newScholarship?.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    // Query tổng số bản ghi
    const totalItems = await this.scholarProvModule.countDocuments(filter);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Thực hiện query học bổng
    const result = await this.scholarProvModule
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
      return `not found scholarship`;
    }
    return await this.scholarProvModule.findById(id)
  }

  async update(id: string, updateScholarProvDto: UpdateScholarProvDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found scholarship`;
    const updated = await this.scholarProvModule.updateOne(
      { _id: id },
      {
        ...updateScholarProvDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found scholarship`;
    await this.scholarProvModule.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.scholarProvModule.softDelete({
      _id: id
    })
  }

  async getListAll() {
    const scholarships = await this.scholarProvModule.find().select('name').exec()
    return {
      scholarships
    }
  }

  async findByProvider(providerId: string): Promise<ScholarProv[]> {
    return this.scholarProvModule.find({ provider: providerId }).exec();
  }
}
