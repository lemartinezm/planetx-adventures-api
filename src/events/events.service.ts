import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { event as EventModel } from '@prisma/client';
import { Event } from './entities/event.entity';
import {
  FindAllQueryParams,
  FindAllResponse,
} from './interfaces/events.service';
import { PaginatedResponse } from 'src/interfaces/response.interface';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async createEvent(event: Event): Promise<Omit<EventModel, 'created_at'>> {
    return await this.prismaService.event.create({
      data: event,
      select: { id: true, name: true, description: true, created_by: true },
    });
  }

  async findAll({
    page = 1,
    elementsPerPage = 10,
  }: FindAllQueryParams): Promise<FindAllResponse> {
    // TODO: verificar si el _count está realizando bien el conteo
    const totalCount = await this.prismaService.event.count();
    const totalPages = Math.ceil(totalCount / elementsPerPage);

    const eventsFound = await this.prismaService.event.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        user: { select: { id: true, email: true } },
        _count: {
          select: {
            event_like: true,
            event_views: true,
            vote: true,
          },
        },
      },
      skip: (page - 1) * elementsPerPage,
      take: elementsPerPage,
      orderBy: { created_at: 'asc' },
    });

    const eventsFormated = eventsFound.map(({ _count, ...rest }) => {
      return {
        ...rest,
        count: {
          eventLikes: _count.event_like,
          eventViews: _count.event_views,
          votes: _count.vote,
        },
      };
    });

    const resultPaginated: PaginatedResponse<typeof eventsFormated> = {
      data: eventsFormated,
      currentPage: page,
      elementsPerPage,
      totalPages,
      totalItems: totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
    return resultPaginated;
  }
}
