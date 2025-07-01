import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop()
  content: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
