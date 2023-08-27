import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UserDocument } from 'src/schemas/users/user.schema';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  messages: Chat[] = [{ name: 'udassi', text: 'ee kya hui gao', groupId: '1' }];
  clientToUser = {};
  identify(userData: UserDocument, clientId: string) {
    return (this.clientToUser[clientId] = userData.name);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
  create(msg: Chat) {
    const message = { ...msg };
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
