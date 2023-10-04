import { Injectable } from '@nestjs/common';
import { GroupsService } from 'src/schemas/groups/groups.service';
@Injectable()
export class ChatService {
  constructor(private readonly groupService: GroupsService) {}
  create({ sender, text, groupId, senderName, image, video }) {
    return this.groupService.addText(
      sender,
      text,
      groupId,
      senderName,
      image,
      video,
    );
  }
}
