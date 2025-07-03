import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    const message = new this.messageModel(createMessageDto);
    return message.save();
  }

  async findAll(workspaceId: string): Promise<MessageDocument[]> {
    return this.messageModel
      .find({ workspace: workspaceId })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUsers(senderId: string, receiverId: string): Promise<MessageDocument[]> {
    return this.messageModel
      .find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 })
      .exec();
  }

  async markAsRead(messageId: string): Promise<MessageDocument> {
    return this.messageModel.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true },
    ).exec();
  }

  getHello(): string {
    return 'messages service';
  }
}