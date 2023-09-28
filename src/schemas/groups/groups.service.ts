import { Injectable, UseGuards } from '@nestjs/common';
import { GroupsRepository } from './groups.repository';
import { Group, GroupDocument } from './groups.schema';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import mongoose from 'mongoose';
import 'bson';
import { Message } from '../chats/message.schema';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly usersService: UsersService,
  ) {}
  async getGroupById(groupId: string): Promise<Group> {
    return await this.groupsRepository.findOne({ _id: groupId });
  }

  async getGroupByName(groupName: string): Promise<GroupDocument> {
    return await this.groupsRepository.findOne({ name: groupName });
  }

  async createGroup(
    name: string,
    creatorId: mongoose.Schema.Types.ObjectId,
    members: mongoose.Schema.Types.ObjectId[],
    image: string,
    description: string,
  ): Promise<GroupDocument | string> {
    const allGroups = await this.getAllGroups();
    if (allGroups.find((g) => g.name == name)) {
      console.log('already exists');
      return 'Name already exists';
    }
    const createdGroup = await this.groupsRepository.create({
      name,
      image,
      description,
      members,
      admin: creatorId,
      history: [],
      docs: [],
      files: [],
    });

    members.map(async (memberId) => {
      await this.usersService.updateUser(
        { _id: memberId },
        { $push: { groups: String(createdGroup._id) } },
      );
    });

    return createdGroup;
  }

  async addText(
    sender: mongoose.Schema.Types.ObjectId,
    text: string,
    groupId: string,
    senderName,
    image: string,
    video: string,
  ) {
    const message: Message = {
      video,
      text,
      sender,
      senderName,
      timestamp: Date.now(),
      image,
    };
    await this.groupsRepository.findOneAndUpdate(
      { _id: groupId },
      { $push: { history: message } },
    );
    return message;
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

  async updateDoc(groupId, docName) {
    const myDoc = this.groupsRepository.findOne({ _id: groupId });
  }
}
