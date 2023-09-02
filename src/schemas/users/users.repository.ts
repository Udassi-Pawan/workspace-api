import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findOne(userFilterQuery: FilterQuery<User>): Promise<UserDocument> {
    return this.userModel.findOne(userFilterQuery);
  }
  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: User,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(userFilterQuery, user, {
      populate: { path: 'groups' },
    });
  }
  async findAll() {
    // console.log('all', this.userModel.find({}));
    return this.userModel.find({});
  }
}
