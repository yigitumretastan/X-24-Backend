import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Workspace } from '../../workspace/schemas/workspace.schema';


export type UserDocument = Document & User & { _id: Types.ObjectId };

@Schema()
export class User {
  @Prop() profilePicture?: string;

  @Prop({ required: true }) name: string;
  @Prop({ required: true }) lastname: string;

  @Prop({ unique: true }) email: string;
  @Prop({ unique: true }) phone: string;
  @Prop() password?: string;

  @Prop({ default: 'Member' }) role: string;
  @Prop() position?: string;
  @Prop() department?: string;
  @Prop() workType?: string;
  @Prop() workLocation?: string;
  @Prop() team?: string;
  @Prop() gender?: string;

  @Prop({
    type: Object,
    default: {},
  })
  links?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };

  @Prop() bio?: string;

  @Prop({ type: Types.ObjectId, ref: 'Workspace' })
  workspace: Workspace | Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
