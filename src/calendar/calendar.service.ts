import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CalendarEvent, CalendarEventDocument } from './schemas/calendar-event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(CalendarEvent.name)
    private calendarEventModel: Model<CalendarEventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<CalendarEventDocument> {
    const event = new this.calendarEventModel(createEventDto);
    return event.save();
  }

  async findAll(workspaceId: string): Promise<CalendarEventDocument[]> {
    const events = await this.calendarEventModel.find({ workspaceId }).exec();
    return events;
  }

  async findOne(id: string): Promise<CalendarEventDocument> {
    const event = await this.calendarEventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<CalendarEventDocument> {
    const updatedEvent = await this.calendarEventModel.findByIdAndUpdate(id, updateEventDto, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return updatedEvent;
  }

  async remove(id: string): Promise<CalendarEventDocument> {
    const deletedEvent = await this.calendarEventModel.findByIdAndDelete(id).exec();
    if (!deletedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return deletedEvent;
  }
}
