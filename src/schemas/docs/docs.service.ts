import { Injectable } from '@nestjs/common';
import { DocsRepository } from './docs.repository';
import 'bson';
import { GroupsRepository } from '../groups/groups.repository';
import { GroupsService } from '../groups/groups.service';

@Injectable()
export class DocsService {
  constructor(
    private readonly docsRepository: DocsRepository,
    private readonly groupsRepository: GroupsRepository, // private readonly groupsService: GroupsService,
  ) {}
  async createDoc(groupId, docName, text) {
    const docFinalName = `${groupId} ${docName}`;
    const doc = {
      name: docFinalName,
      timestamp: Date.now(),
      text,
      groupId: groupId,
    };
    const savedDoc = await this.docsRepository.create(doc);
    const finalGroup = await this.groupsRepository.findOneAndUpdate(
      { _id: groupId },
      { $push: { docs: savedDoc._id } },
    );
    return finalGroup;
  }
  async updateDoc(groupId, docName, text) {
    const docFinalName = `${groupId} ${docName}`;
    const doc = {
      name: docFinalName,
      timestamp: Date.now(),
      text,
    };
    return await this.docsRepository.findOneAndUpdate(
      { name: docFinalName },
      {
        text: text,
        timestamp: Date.now(),
      },
    );
  }
  async findDoc(name) {
    return await this.docsRepository.findOne({ name: name });
  }
}
