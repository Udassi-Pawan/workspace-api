import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './files.schema';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class FilesRepository {
  constructor(@InjectModel('File') private FileModel: Model<FileDocument>) {}
  async findOne(DocFilterQuery: FilterQuery<File>): Promise<File> {
    return this.FileModel.findOne(DocFilterQuery);
  }
  async create(File: File): Promise<FileDocument> {
    const newDoc = new this.FileModel(File);
    return newDoc.save();
  }
}
