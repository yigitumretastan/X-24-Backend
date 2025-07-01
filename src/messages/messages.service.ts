import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  getHello(): string {
    return 'messages service';
  }
}
