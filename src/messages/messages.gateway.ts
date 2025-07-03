import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🟢 Client connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔴 Client disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.create(createMessageDto);

    // Oda: workspace varsa ona yayın yap, yoksa birebir oda
    const room = createMessageDto.workspace
      ? `workspace_${createMessageDto.workspace}`
      : this.getPrivateRoomName(createMessageDto.sender, createMessageDto.receiver);

    this.server.to(room).emit('newMessage', message);

    return message;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  private getPrivateRoomName(user1: string, user2: string): string {
    return ['private', user1, user2].sort().join('_');
  }
}
