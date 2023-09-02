import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async getUser(email): Promise<UserDocument> {
    return this.usersRepository.findOne({ email });
  }
  async createUser(email: string, name: string): Promise<User> {
    return this.usersRepository.create({
      email,
      name,
      groups: [],
    });
  }
  async updateUser(filter, update) {
    return this.usersRepository.findOneAndUpdate(filter, update);
  }
  async findAll() {
    return await this.usersRepository.findAll();
  }
}
