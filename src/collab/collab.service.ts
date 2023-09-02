import { Injectable } from '@nestjs/common';

@Injectable()
export class CollabService {
  remove(id: number) {
    return `This action removes a #${id} Collab`;
  }
}
