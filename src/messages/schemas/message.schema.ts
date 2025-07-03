// message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  receivers: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspace: Types.ObjectId;

  @Prop({ type: String, default: '' })
  channel: string;

  @Prop({ default: 'text' })
  type: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  viewers: Types.ObjectId[];

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        isRead: { type: Boolean, default: false },
        readAt: { type: Date, default: null },
      },
    ],
    default: [],
  })
  readStatus: {
    user: Types.ObjectId;
    isRead: boolean;
    readAt: Date | null;
  }[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
