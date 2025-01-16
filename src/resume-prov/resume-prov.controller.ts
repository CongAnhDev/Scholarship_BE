import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  Public,
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateUserCvProDto } from './dto/create-resume-prov.dto';
import { ResumeProvService } from './resume-prov.service';

@Controller('resume-prov')
export class ResumeProvController {
  constructor(
    private readonly resumeProvService: ResumeProvService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  @SkipCheckPermission()
  @ResponseMessage('Create a new resume')
  @UseInterceptors(
    FileInterceptor('urlCV', {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserCvProDto: CreateUserCvProDto,
    @User() user: IUser,
  ) {
    try {
      const uploadedFileResponse =
        await this.cloudinaryService.uploadFile(file);
      const urlCV = uploadedFileResponse.url;
      return this.resumeProvService.create(
        {
          ...createUserCvProDto,
          urlCV,
        },
        user,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('by-user')
  @SkipCheckPermission()
  @ResponseMessage('Get Resumes by User')
  getResumesByUser(@User() user: IUser) {
    return this.resumeProvService.findByUsers(user);
  }

  @Get()
  @ResponseMessage('Fetch all resumes with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumeProvService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @SkipCheckPermission()
  @ResponseMessage('Fetch a resume by id')
  findOne(@Param('id') id: string) {
    return this.resumeProvService.findOne(id);
  }

  @Patch(':id')
  @SkipCheckPermission()
  @ResponseMessage('Update a resume')
  update(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note: string,
    @User() user: IUser,
  ) {
    return this.resumeProvService.update(id, status, note, user);
  }

  @ResponseMessage('Delete a resume')
  @SkipCheckPermission()
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumeProvService.remove(id, user);
  }

  @Post('excel')
  @ResponseMessage('export resumes to excel')
  export(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumeProvService.export(+currentPage, +limit, qs);
  }
}
