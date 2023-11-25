import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prismaService: PrismaService) {}

  async createTicket(ticket: CreateTicketDto) {
    const newTicket = await this.prismaService.ticket.create({
      data: {
        name: ticket.name,
        reservation_date: ticket.reservationDate,
        seat_code: ticket.seatCode,
        travel_from: ticket.travelFrom,
        travel_to: ticket.travelTo,
      },
      select: {
        id: true,
        name: true,
        reservation_date: true,
        seat_code: true,
        travel_from: true,
        travel_to: true,
      },
    });

    return {
      id: newTicket.id,
      name: newTicket.name,
      reservationDate: newTicket.reservation_date,
      seatCode: newTicket.seat_code,
      travelFrom: newTicket.travel_from,
      travelTo: newTicket.travel_to,
    };
  }

  async getTicketById(id: number) {
    const ticket = await this.prismaService.ticket.findFirst({
      select: {
        id: true,
        name: true,
        seat_code: true,
        reservation_date: true,
        travel_from: true,
        travel_to: true,
      },
      where: { id },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');

    return {
      id: ticket.id,
      name: ticket.name,
      seatCode: ticket.seat_code,
      reservationDate: ticket.reservation_date,
      travelFrom: ticket.travel_from,
      travelTo: ticket.travel_to,
    };
  }
}
