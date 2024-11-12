import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('subscribers') 
@Controller('subscribers') 
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {} 

  // Endpoint to create a new subscriber
  @Post()
<<<<<<< HEAD
  @ResponseMessage("create a subscriber") 
=======
  @SkipCheckPermission()
  @ResponseMessage("create a subscriber")
>>>>>>> ed4d070b49f6c10efa1623603a33b01a5a1481f1
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user); 
  }

  // Endpoint to retrieve a subscriber's subject without checking permissions
  @Post("subject")
<<<<<<< HEAD
  @ResponseMessage("Get subscriber's subject")
  @SkipCheckPermission() 
  getUserSubject(@Query("id") id: string) {
    return this.subscribersService.getSubject(id); 
=======
  @ResponseMessage("Get subscriber's major")
  @SkipCheckPermission()
  getUserSubject(@User() user: IUser) {
    return this.subscribersService.getSubject(user);
>>>>>>> ed4d070b49f6c10efa1623603a33b01a5a1481f1
  }

  // Endpoint to fetch a paginated list of subscribers
  @Get()
  @SkipCheckPermission()
  @ResponseMessage("fetch list subscriber with paginate")
  findAll(
    @Query("current") currentPage: string, 
    @Query("pageSize") limit: string, 
    @Query() qs: string 
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs); 
  }

  // Endpoint to fetch a single subscriber by their ID
  @Get(':id')
  @SkipCheckPermission()
  @ResponseMessage("fetch a subscriber by id")
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id); 
  }

<<<<<<< HEAD
  // Endpoint to update an existing subscriber, skips permission check
  @Patch(':id')
=======
  @Patch()
>>>>>>> ed4d070b49f6c10efa1623603a33b01a5a1481f1
  @ResponseMessage("Update a subscriber")
  @SkipCheckPermission() 
  update(
<<<<<<< HEAD
    @Param("id") id: string, 
    @Body() updateSubscriberDto: UpdateSubscriberDto, 
    @User() user: IUser 
  ) {
    return this.subscribersService.update(id, updateSubscriberDto, user); 
=======
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser
  ) {
    return this.subscribersService.update(updateSubscriberDto, user);
>>>>>>> ed4d070b49f6c10efa1623603a33b01a5a1481f1
  }

  // Endpoint to delete a subscriber
  @Delete(':id')
  @SkipCheckPermission()
  @ResponseMessage("Delete a subscriber")
  remove(
    @Param('id') id: string, 
    @User() user: IUser 
  ) {
    return this.subscribersService.remove(id, user); // Calls service to remove the subscriber by ID
  }
}