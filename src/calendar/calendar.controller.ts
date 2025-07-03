import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';

@ApiTags('Calendar')
@ApiBearerAuth()
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @ApiQuery({ name: 'workspaceId', required: true })
  findAll(@Query('workspaceId') workspaceId: string) {
    return this.calendarService.findAll(workspaceId);
  }
}
