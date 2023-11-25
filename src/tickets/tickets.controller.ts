import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('tickets')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Ticket created successfully' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.createTicket(createTicketDto);
  }

  @Get(':ticketId')
  @ApiOkResponse({ description: 'Ticket with id {ticketId} found' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiNotFoundResponse({ description: 'Ticket with id {ticketId} not found' })
  @ApiNotAcceptableResponse({ description: '{ticketId} must be a number' })
  async findTicketById(
    @Param(
      'ticketId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    ticketId: number,
  ) {
    return this.ticketsService.getTicketById(ticketId);
  }
}
