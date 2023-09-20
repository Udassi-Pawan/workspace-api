import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {
  findAll() {
    return `This action returns all bot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bot`;
  }

  remove(id: number) {
    return `This action removes a #${id} bot`;
  }
}
