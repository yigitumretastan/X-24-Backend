import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop()
  taskField: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
