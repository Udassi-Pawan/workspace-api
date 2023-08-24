import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

class CreateUserDto {
  email: string;
  name: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('create')
  async createUser(@Body() data: CreateUserDto) {
    // console.log('create user');
    // return 'working';
    return this.usersService.createUser(data.email, data.name);
  }
  @Get('/:email')
  async getUser(@Param('email') email) {
    return this.usersService.getUser(email);
  }
}
