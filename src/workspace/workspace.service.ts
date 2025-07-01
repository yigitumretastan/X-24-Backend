import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workspace, WorkspaceDocument } from './schemas/workspace.schema';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name)
    private workspaceModel: Model<WorkspaceDocument>,
  ) {}

  // Yeni workspace oluşturur
  async create(dto: CreateWorkspaceDto) {
    if (!dto.name) {
      throw new Error('Workspace name is required');
    }
    const workspace = new this.workspaceModel(dto);
    return workspace.save();
  }

  // Davet koduna göre workspace bulur
  async findByInviteCode(code: string) {
    return this.workspaceModel.findOne({ inviteCode: code });
  }

  // Workspace'e üye ekler (tekrar eklenmesini engeller)
  async addMember(workspaceId: string, userId: string) {
    return this.workspaceModel.findByIdAndUpdate(
      workspaceId,
      { $addToSet: { members: userId } }, // $addToSet tekrar eklemeyi önler
      { new: true },
    );
  }

  // Workspace ID'ye göre getir
  async findById(id: string) {
    return this.workspaceModel.findById(id).populate('members');
  }

  // Tüm workspaceleri listele (opsiyonel)
  async getAll() {
    return this.workspaceModel.find();
  }
}
