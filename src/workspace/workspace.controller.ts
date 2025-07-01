import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Body() dto: CreateWorkspaceDto) {
    return this.workspaceService.create(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.workspaceService.findById(id);
  }

  @Get('invite/:code')
  async getByInviteCode(@Param('code') code: string) {
    return this.workspaceService.findByInviteCode(code);
  }
}
