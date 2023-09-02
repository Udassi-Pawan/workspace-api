import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GroupsService } from '../groups/groups.service';

class CreateUserDto {
  email: string;
  name: string;
}

class Request {
  user: any;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
  ) {}
  @Post('create')
  async createUser(@Body() data: CreateUserDto) {
    // console.log('create user');
    // return 'working';
    return this.usersService.createUser(data.email, data.name);
  }

  @Get('/all')
  findAll() {
    // console.log('get all users', this.usersService.findAll());
    return this.usersService.findAll();
  }

  @Get('/:email')
  async getUser(@Param('email') email) {
    return this.usersService.getUser(email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/join')
  async joinGroup(@Req() req: Request, @Body() data: { groupId: string }) {
    // console.log('user join');
    const userFromDb = await this.usersService.getUser(req.user.email);
    await this.groupsService.joinGroup(userFromDb._id, data.groupId);
    const updatedUser = await this.usersService.updateUser(
      { _id: userFromDb._id },
      {
        $push: { groups: data.groupId },
      },
    );
    return updatedUser;
  }
}
