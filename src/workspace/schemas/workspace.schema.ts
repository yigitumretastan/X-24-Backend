import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkspaceDocument = Workspace & Document;

@Schema({ timestamps: true })
export class Workspace {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  inviteCode: string;

  @Prop({ type: [String], default: [] })
  members: string[]; // userId listesi

  @Prop({ required: true })
  ownerId: string;

  @Prop({ type: Object, default: {} })
  dashboardData: Record<string, any>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
  messages: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
  tasks: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }], default: [] })
  projects: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'CalendarEvent' }], default: [] })
  calendarEvents: Types.ObjectId[];

  @Prop({ type: Object, default: {} })
  analytics: Record<string, any>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'File' }], default: [] })
  files: Types.ObjectId[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
