import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { AuthGuard } from '../auth/auth.guard';
import { JwtUser } from 'src/users/interfaces/user.interface';

@Controller('events')
@UsePipes(new ValidationPipe())
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Request() req: Request & { user: JwtUser },
  ) {
    // Obtain logged in user id
    const { id } = req.user;
    const event: Event = { ...createEventDto, created_by: id };
    return this.eventsService.createEvent(event);
  }
}
