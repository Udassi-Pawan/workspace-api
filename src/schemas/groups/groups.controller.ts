import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

class CreateUserDto {
  name: string;
  members: string[];
}

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
  async createGroup(@Body() data: CreateUserDto, @Req() req: Request) {
    const userFromDb  = await this.usersService.getUser(req.user.email);
    return this.groupsService.createGroup(data.name, userFromDb._id);
  }

  @Get('test')
  test() {
    return 'sg';
  }
}
