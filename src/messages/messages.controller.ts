import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('workspace/:workspaceId')
  async findAllByWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.messagesService.findAllByWorkspace(workspaceId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.messagesService.getMessageResponseDto(id);
  }
}
