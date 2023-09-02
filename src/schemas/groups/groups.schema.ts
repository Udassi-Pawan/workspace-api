import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Message } from '../chats/message.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  admin: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  members: mongoose.Schema.Types.ObjectId[];

  @Prop()
  history: Message[];
}

export const GroupsSchema = SchemaFactory.createForClass(Group);
