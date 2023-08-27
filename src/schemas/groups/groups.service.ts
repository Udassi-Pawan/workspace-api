import { Injectable, UseGuards } from '@nestjs/common';
import { GroupsRepository } from './groups.repository';
import { Group, GroupDocument } from './groups.schema';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import mongoose from 'mongoose';
import 'bson';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository, // private readonly usersService: UsersService,
  ) {}
  async getGroupById(userId: string): Promise<Group> {
    return this.groupsRepository.findOne({ userId });
  }

  async createGroup(
    name: string,
    creatorId: mongoose.Schema.Types.ObjectId,
  ): Promise<GroupDocument> {
    const createdGroup = await this.groupsRepository.create({
      name,
      members: [creatorId],
    });
    console.log(createdGroup._id);
    // await this.usersService.updateUser(
    //   { _id: creatorId },
    //   { $push: { groups: String(createdGroup._id) } },
    // );
    console.log('req');
    return createdGroup;
  }
  async joinGroup(userId: string, groupId: string) {
    await this.groupsRepository.findOneAndUpdate(
      { _id: groupId },
      { $push: { members: userId } },
    );
  }
}
