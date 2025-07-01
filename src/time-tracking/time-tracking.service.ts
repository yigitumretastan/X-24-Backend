import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TimeEntry } from './schemas/time-entry.schema';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';

@Injectable()
export class TimeTrackingService {
  constructor(
    @InjectModel(TimeEntry.name) private timeEntryModel: Model<TimeEntry>,
  ) {}

  async startTimeEntry(userId: string, createDto: CreateTimeEntryDto): Promise<TimeEntry> {
    // Aktif oturum varsa hata atabiliriz veya sonlandırabiliriz (isteğe göre)
    const activeEntry = await this.timeEntryModel.findOne({ userId, isActive: true });
    if (activeEntry) {
      throw new ForbiddenException('Zaten aktif bir zaman takibi mevcut.');
    }

    const newEntry = new this.timeEntryModel({
      userId: new Types.ObjectId(userId),
      workspaceId: new Types.ObjectId(createDto.workspaceId),
      startedAt: new Date(),
      isActive: true,
      totalPausedDuration: 0,
      description: '',
    });

    return newEntry.save();
  }

  async pauseTimeEntry(userId: string, id: string): Promise<TimeEntry> {
    const entry = await this.timeEntryModel.findById(id);
    if (!entry) throw new NotFoundException('Zaman kaydı bulunamadı.');
    if (!entry.isActive) throw new ForbiddenException('Zaman kaydı aktif değil.');
    if (entry.userId.toString() !== userId) throw new ForbiddenException('Yetkiniz yok.');

    entry.pausedAt = new Date();
    entry.isActive = false;

    return entry.save();
  }

  async resumeTimeEntry(userId: string, id: string): Promise<TimeEntry> {
    const entry = await this.timeEntryModel.findById(id);
    if (!entry) throw new NotFoundException('Zaman kaydı bulunamadı.');
    if (entry.isActive) throw new ForbiddenException('Zaman kaydı zaten aktif.');
    if (entry.userId.toString() !== userId) throw new ForbiddenException('Yetkiniz yok.');
    if (!entry.pausedAt) throw new ForbiddenException('Zaman kaydı duraklatılmamış.');

    const pausedDurationMs = new Date().getTime() - entry.pausedAt.getTime();
    entry.totalPausedDuration += pausedDurationMs / 1000;
    entry.pausedAt = null;
    entry.isActive = true;

    return entry.save();
  }

  async finishTimeEntry(userId: string, id: string, description?: string): Promise<TimeEntry> {
    const entry = await this.timeEntryModel.findById(id);
    if (!entry) throw new NotFoundException('Zaman kaydı bulunamadı.');
    if (entry.userId.toString() !== userId) throw new ForbiddenException('Yetkiniz yok.');

    if (entry.isActive) {
      // Duraklatıldıysa toplam duraklama süresi güncellenir
      if (entry.pausedAt) {
        const pausedDurationMs = new Date().getTime() - entry.pausedAt.getTime();
        entry.totalPausedDuration += pausedDurationMs / 1000;
        entry.pausedAt = null;
      }
      entry.isActive = false;
    }
    entry.finishedAt = new Date();
    if (description) entry.description = description;

    return entry.save();
  }
}
