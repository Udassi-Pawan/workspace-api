import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doc, DocDocument } from './docs.schema';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';

@Injectable()
export class DocsRepository {
  constructor(@InjectModel('Doc') private DocModel: Model<DocDocument>) {}
  async findOne(DocFilterQuery: FilterQuery<Doc>): Promise<Doc> {
    return this.DocModel.findOne(DocFilterQuery);
  }
  async create(Doc: Doc): Promise<DocDocument> {
    const newDoc = new this.DocModel(Doc);
    return newDoc.save();
  }
  async findOneAndUpdate(
    DocFilterQuery: FilterQuery<Doc>,
    Doc: UpdateQuery<Doc>,
  ): Promise<Doc> {
    return this.DocModel.findOneAndUpdate(DocFilterQuery, Doc);
  }
}
