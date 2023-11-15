import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@Controller('events')
@UsePipes(new ValidationPipe())
@ApiTags('Events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ description: 'Event created successfully' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Request() req: Request & { user: JwtUser },
  ) {
    // Obtain logged in user id
    const { id } = req.user;
    const event: Event = { ...createEventDto, created_by: id };
    return await this.eventsService.createEvent(event);
  }

  @Get()
  @ApiOkResponse({ description: 'Events successfully obtained' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiQuery({ name: 'p', required: false, description: 'Page number' })
  @ApiQuery({ name: 'epp', required: false, description: 'Elements per page' })
  async getEvents(
    @Query('p', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('epp', new DefaultValuePipe(5), ParseIntPipe)
    elementsPerPage: number,
  ) {
    return await this.eventsService.findAll({ page, elementsPerPage });
  }

  @Put(':eventId/like')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Event liked successfully' })
  @ApiConflictResponse({ description: 'User already liked the event' })
  async likeEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Request() req: Request & { user: JwtUser },
  ) {
    const { id: userId } = req.user;
    return await this.eventsService.likeEvent({ eventId, userId });
  }
}
