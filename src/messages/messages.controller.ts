import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Mesaj gönder' })
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'Workspace mesajlarını getir' })
  async findByWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.messagesService.findAll(workspaceId);
  }

  @Get('users/:senderId/:receiverId')
  @ApiOperation({ summary: 'İki kullanıcı arasındaki mesajları getir' })
  async findByUsers(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.messagesService.findByUsers(senderId, receiverId);
  }
}