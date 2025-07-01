import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('workspace/:workspaceId')
  async getUsersByWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.usersService.findAllByWorkspace(workspaceId);
  }
}
