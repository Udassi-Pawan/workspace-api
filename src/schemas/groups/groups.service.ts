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
    private readonly groupsRepository: GroupsRepository,
    private readonly usersService: UsersService,
  ) {}
  async getGroupById(userId: string): Promise<Group> {
    return this.groupsRepository.findOne({ userId });
  }

  async createGroup(
    name: string,
    creatorId: mongoose.Schema.Types.ObjectId,
    members: mongoose.Schema.Types.ObjectId[],
  ): Promise<GroupDocument | string> {
    const allGroups = await this.getAllGroups();
    if (allGroups.find((g) => g.name == name)) {
      console.log('already exists');
      return 'Name already exists';
    }
    const createdGroup = await this.groupsRepository.create({
      name,
      members,
      admin: creatorId,
    });
    console.log(createdGroup._id);

    members.map(async (memberId) => {
      await this.usersService.updateUser(
        { _id: memberId },
        { $push: { groups: String(createdGroup._id) } },
      );
    });

    console.log('req');
    return createdGroup;
  }
  async joinGroup(userId: string, groupId: string) {
    await this.groupsRepository.findOneAndUpdate(
      { _id: groupId },
      { $push: { members: userId } },
    );
  }
  async getAllGroups() {
    return await this.groupsRepository.findAll();
  }
}
