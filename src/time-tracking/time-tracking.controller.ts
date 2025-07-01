import { Controller, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { TimeTrackingService } from './time-tracking.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@UseGuards(JwtAuthGuard)
@Controller('time-tracking')
export class TimeTrackingController {
  constructor(private readonly timeTrackingService: TimeTrackingService) {}

  @Post('start')
  async start(
    @GetUser('id') userId: string,
    @Body() createDto: CreateTimeEntryDto,
  ) {
    return this.timeTrackingService.startTimeEntry(userId, createDto);
  }

  @Patch(':id/pause')
  async pause(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.timeTrackingService.pauseTimeEntry(userId, id);
  }

  @Patch(':id/resume')
  async resume(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.timeTrackingService.resumeTimeEntry(userId, id);
  }

  @Patch(':id/finish')
  async finish(
    @Param('id') id: string,
    @Body() updateDto: UpdateTimeEntryDto,
    @GetUser('id') userId: string,
  ) {
    return this.timeTrackingService.finishTimeEntry(userId, id, updateDto.description);
  }
}
