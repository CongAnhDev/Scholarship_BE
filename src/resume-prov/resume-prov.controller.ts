import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumeProvService } from './resume-prov.service';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { CreateUserCvProDto } from './dto/create-resume-prov.dto';
import { IUser } from 'src/users/users.interface';


@Controller('resume-prov')
export class ResumeProvController {
  constructor(private readonly resumeProvService: ResumeProvService) { }

  @Post()
  @SkipCheckPermission()
  @ResponseMessage("Create a new resume")
  create(@Body() createUserCvProDto: CreateUserCvProDto, @User() user: IUser) {
    return this.resumeProvService.create(createUserCvProDto, user);
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
  @ResponseMessage("Update a resume")
  update(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note: string,
    @User() user: IUser

  ) {
    return this.resumeProvService.update(id, status, note, user);
  }

  @ResponseMessage("Delete a resume")
  @SkipCheckPermission()
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumeProvService.remove(id, user);
  }

  @Post('excel')
  @Public()
  @ResponseMessage('export resumes to excel')
  export(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumeProvService.export(+currentPage, +limit, qs);
  }
}
