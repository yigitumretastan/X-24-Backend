import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  getHello(): string {
    return 'tasks service';
  }
}
