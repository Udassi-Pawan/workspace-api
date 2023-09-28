import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import mongoose from 'mongoose';
import { User } from '../users/user.schema';

class Request {
  user: User;
}

@Controller('group')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createGroup(
    @Body('members') members: mongoose.Schema.Types.ObjectId[],
    @Body('name') name: string,
    @Body('image') image: string,
    @Body('description') description: string,
    @Req() req: Request,
  ) {
    const userFromDb = await this.usersService.getUser(req.user.email);
    return this.groupsService.createGroup(
      name,
      userFromDb._id,
      [userFromDb._id, ...members],
      image,
      description,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/single/:groupId')
  async getGroupById(@Param('groupId') groupId, @Req() req: Request) {
    const group = await this.groupsService.getGroupById(groupId);
    console.log('group request');
    if (group.members.find((m: any) => m.email == req.user.email)) return group;
    else return 'You are not a member';
  }

  @Get('all')
  all() {
    return this.groupsService.getAllGroups();
  }
}
