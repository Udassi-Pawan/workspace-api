import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.schema';
import { uuidV4 } from 'ethers';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async getUser({ _id = '', email = '' }): Promise<User> {
    if (_id) return this.usersRepository.findOne({ _id });
    else if (email) return this.usersRepository.findOne({ email });
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
}
