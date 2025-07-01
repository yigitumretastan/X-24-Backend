import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  getHello(): string {
    return 'roles service';
  }
}
