import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Group',
    required: true,
  })
  groups: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'File',
    required: true,
  })
  files: mongoose.Schema.Types.ObjectId[];

  @Prop()
  notificationToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
