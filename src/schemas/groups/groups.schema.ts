import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop()
  name: string;

  @Prop()
  members: string[];
}

export const GroupsSchema = SchemaFactory.createForClass(Group);
