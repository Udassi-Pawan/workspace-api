import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Message } from '../chats/message.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop()
  image: string;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  admin: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  members: mongoose.Schema.Types.ObjectId[];

  @Prop()
  history: Message[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Doc' })
  docs: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'File' })
  files: mongoose.Schema.Types.ObjectId[];
}

export const GroupsSchema = SchemaFactory.createForClass(Group);
