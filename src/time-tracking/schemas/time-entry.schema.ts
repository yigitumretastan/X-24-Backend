import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TimeEntry extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  startedAt: Date;

  @Prop({ type: Date, required: false, default: null })
  pausedAt: Date | null;

  @Prop({ type: Date, required: false, default: null })
  resumedAt: Date | null;
  
  @Prop({ type: Date, required: false })
  finishedAt?: Date;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  totalPausedDuration: number;

  @Prop({ type: String, default: '' })
  description: string;
}

export const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);
