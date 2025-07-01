import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  getHello(): string {
    return 'analytics service';
  }
}
