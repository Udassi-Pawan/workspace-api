import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes } from 'mongoose';
import { User } from '../users/user.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop()
  name: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  members: mongoose.Schema.Types.ObjectId[];
}

export const GroupsSchema = SchemaFactory.createForClass(Group);

// type: [mongoose.Schema.Types.ObjectId],
