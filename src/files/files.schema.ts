import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  extension: string;

  @Prop({
    required: true,
    unique: true,
  })
  timestamp: number;
}

export const FilesSchema = SchemaFactory.createForClass(File);
