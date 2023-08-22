import { Injectable, UseGuards } from '@nestjs/common';
import { GroupsRepository } from './groups.repository';
import { Group, GroupDocument } from './groups.schema';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';

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
    creatorEmail: string,
  ): Promise<GroupDocument> {
    const createdGroup = await this.groupsRepository.create({
      name,
      members: [creatorEmail],
    });
    console.log(createdGroup._id);
    await this.usersService.updateUser(
      { email: creatorEmail },
      { $push: { groups: String(createdGroup._id) } },
    );

    return createdGroup;
  }
}
