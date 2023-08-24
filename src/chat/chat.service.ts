import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  messages = [{ name: 'udassi', text: 'ee kya hui gao' }];
  clientToUser = {};
  identify(name: string, clientId: string) {
    console.log(name, clientId);
    return (this.clientToUser[clientId] = name);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
  create(createChatDto: CreateChatDto) {
    const message = { ...createChatDto };
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
