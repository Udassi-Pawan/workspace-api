import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
  })
  senderName: string;

  @Prop({
    required: true,
    unique: true,
  })
  timestamp: number;

  @Prop({
    required: true,
  })
  text: string;

  @Prop()
  image: string;

  @Prop()
  video: string;
}

export const MessagesSchema = SchemaFactory.createForClass(Message);
