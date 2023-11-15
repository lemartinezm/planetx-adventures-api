import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { event as EventModel } from '@prisma/client';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async createEvent(event: Event): Promise<Omit<EventModel, 'created_at'>> {
    return await this.prismaService.event.create({
      data: event,
      select: { id: true, name: true, description: true, created_by: true },
    });
  }
}
