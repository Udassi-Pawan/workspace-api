import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  messages = [{ name: 'udassi', text: 'ee kya hui gao' }];
  create(createChatDto: CreateChatDto) {
    const message = { ...createChatDto };
    return this.messages.push(message);
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
