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

class Request {
  user: any;
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
    @Req() req: Request,
  ) {
    const userFromDb = await this.usersService.getUser(req.user.email);
    return this.groupsService.createGroup(name, userFromDb._id, [
      userFromDb._id,
      ...members,
    ]);
  }

  @Get('/single/:groupId')
  async getGroupById(@Param('groupId') groupId) {
    return await this.groupsService.getGroupById(groupId);
  }

  @Get('all')
  all() {
    return this.groupsService.getAllGroups();
  }
}
