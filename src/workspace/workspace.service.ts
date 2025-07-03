import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workspace, WorkspaceDocument } from './schemas/workspace.schema';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name)
    private workspaceModel: Model<WorkspaceDocument>,
  ) {}

  private generateInviteCode(length = 4): string {
    return randomBytes(length).toString('hex');
  }

  async create(dto: CreateWorkspaceDto): Promise<WorkspaceDocument> {
    if (!dto.name) throw new Error('Workspace name is required');
    if (!dto.ownerId) throw new Error('OwnerId is required');

    const inviteCode = this.generateInviteCode();

    const workspace = new this.workspaceModel({
      ...dto,
      inviteCode,
      members: [dto.ownerId],
    });

    return workspace.save();
  }

  async findByInviteCode(code: string): Promise<WorkspaceDocument | null> {
    return this.workspaceModel.findOne({ inviteCode: code }).exec();
  }

  async addMember(workspaceId: string, userId: string): Promise<WorkspaceDocument | null> {
    return this.workspaceModel
      .findByIdAndUpdate(
        workspaceId,
        { $addToSet: { members: userId } },
        { new: true },
      )
      .exec();
  }

  async findById(id: string): Promise<WorkspaceDocument | null> {
    return this.workspaceModel.findById(id).populate('members').exec();
  }

  async findByUserId(userId: string): Promise<WorkspaceDocument[]> {
    return this.workspaceModel.find({ members: userId }).exec();
  }

  async getAll(): Promise<WorkspaceDocument[]> {
    return this.workspaceModel.find().exec();
  }
}
