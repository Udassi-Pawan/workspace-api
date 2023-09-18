import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './groups.schema';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';

@Injectable()
export class GroupsRepository {
  constructor(
    @InjectModel(Group.name) private GroupModel: Model<GroupDocument>,
  ) {}
  async findOne(GroupFilterQuery: FilterQuery<Group>): Promise<Group> {
    return this.GroupModel.findOne(GroupFilterQuery)
      .populate('members')
      .populate('files');
  }
  async create(Group: Group): Promise<GroupDocument> {
    const newGroup = new this.GroupModel(Group);
    return newGroup.save();
  }
  async findOneAndUpdate(
    GroupFilterQuery: FilterQuery<Group>,
    Group: UpdateQuery<Group>,
  ): Promise<Group> {
    return this.GroupModel.findOneAndUpdate(GroupFilterQuery, Group);
  }
  async findAll() {
    return this.GroupModel.find({}).populate('members');
  }
}
