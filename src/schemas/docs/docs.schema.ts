import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type DocDocument = Doc & Document;

@Schema()
export class Doc {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  timestamp: number;

  @Prop({
    required: true,
  })
  text: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  groupId: mongoose.Schema.Types.ObjectId;
}

export const DocsSchema = SchemaFactory.createForClass(Doc);
