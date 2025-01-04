import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ScholarProvService } from './scholar-prov.service';
import { CreateScholarProvDto } from './dto/create-scholar-prov.dto';
import { UpdateScholarProvDto } from './dto/update-scholar-prov.dto';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('scholar-prov')
export class ScholarProvController {
  constructor(private readonly scholarProvService: ScholarProvService) { }

  @Post()
  @SkipCheckPermission()
  @ResponseMessage("create a new scholarship")
  create(
    @Body() createScholarProvDto: CreateScholarProvDto,
    @User() user: IUser
  ) {

    return this.scholarProvService.create(createScholarProvDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch List Scholarship with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.scholarProvService.findAll(+currentPage, +limit, qs); // Modify this line
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Fetch a Scholarship with id")
  findOne(@Param('id') id: string) {
    return this.scholarProvService.findOne(id);
  }


  @Patch(':id')
  @SkipCheckPermission()
  @ResponseMessage("Update a Scholarship")
  update(
    @Param('id') id: string,
    @Body() updateScholarProvDto: UpdateScholarProvDto,
    @User() user: IUser

  ) {
    return this.scholarProvService.update(id, updateScholarProvDto, user);
  }

  @Delete(':id')
  @SkipCheckPermission()
  @ResponseMessage("Delete a Scholarship")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.scholarProvService.remove(id, user);
  }
}
