import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  getHello(): string {
    return 'notifications service';
  }
}
