import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CalendarEventDocument = CalendarEvent & Document;

@Schema({ timestamps: true })
export class CalendarEvent {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspace: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  participants: Types.ObjectId[];

  @Prop({ default: 'meeting' })
  type: string;

  @Prop({ default: '#3498db' })
  color: string;

  @Prop({ default: false })
  isAllDay: boolean;

  @Prop({ default: false })
  isRecurring: boolean;

  @Prop()
  recurrenceRule?: string;
}

export const CalendarEventSchema = SchemaFactory.createForClass(CalendarEvent);