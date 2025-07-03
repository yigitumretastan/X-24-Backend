import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto, UserDto, ReadStatusDto } from './dto/message-response.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    const message = new this.messageModel(createMessageDto);
    return message.save();
  }

  private toUserDto(user: any): UserDto | null {
    if (!user) return null;
    return {
      id: user._id?.toString() || '',
      name: user.name || '',
      email: user.email || '',
    };
  }

  private toReadStatusDto(readStatus: MessageDocument['readStatus']): ReadStatusDto[] {
    return readStatus.map((rs) => ({
      userId: rs.user.toString(),
      isRead: rs.isRead,
      readAt: rs.readAt ?? undefined,
    }));
  }

  private toMessageResponseDto(message: MessageDocument): MessageResponseDto {
    return {
      id: (message._id as Types.ObjectId).toString(),
      content: message.content,
      sender: this.toUserDto(message.sender),
      receivers: Array.isArray(message.receivers)
        ? (message.receivers
            .map((r) => this.toUserDto(r))
            .filter((u): u is UserDto => u !== null)) // Type guard ile null filtreleme
        : [],
      workspaceId: message.workspace.toString(),
      channel: message.channel || '',
      type: message.type,
      isRead: message.readStatus.some((rs) => rs.isRead),
      readStatus: this.toReadStatusDto(message.readStatus),
      metadata: message.metadata || {},
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  async findAllByWorkspace(workspaceId: string): Promise<MessageResponseDto[]> {
    const messages = await this.messageModel
      .find({ workspace: workspaceId })
      .populate('sender', 'name email')
      .populate('receivers', 'name email')
      .sort({ createdAt: -1 })
      .exec();

    return Promise.all(messages.map((msg) => this.toMessageResponseDto(msg)));
  }

  async getMessageResponseDto(id: string): Promise<MessageResponseDto> {
    const message = await this.messageModel
      .findById(id)
      .populate('sender', 'name email')
      .populate('receivers', 'name email')
      .exec();

    if (!message) throw new NotFoundException('Message not found');

    return this.toMessageResponseDto(message);
  }
}
