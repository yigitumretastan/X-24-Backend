import { Injectable } from '@nestjs/common';

@Injectable()
export class CalendarService {
  getHello(): string {
    return 'calendar service';
  }
}
