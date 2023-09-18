import { Injectable } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import mongoose from 'mongoose';

@Injectable()
export class FilesService {
  constructor(private readonly filesRepository: FilesRepository) {}
  createFile(
    filetype: string,
    name: string,
    creator: mongoose.Schema.Types.ObjectId,
  ) {
    const type = filetype.split('/')[0];
    const extension = filetype.split('/')[1];
    const file = {
      owner: creator,
      name,
      type,
      extension,
      timestamp: Date.now(),
    };
    return this.filesRepository.create(file);
  }
}
