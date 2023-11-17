import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateGuestReservationParams,
  CreateReservationParams,
} from './interfaces/reservations.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReservationsService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async createReservation({ userId, toDate }: CreateReservationParams) {
    return await this.prismaService.reservation.create({
      data: { user_id: userId, to_date: toDate },
      select: { id: true, to_date: true },
    });
  }

  async createGuestReservation({
    name,
    email,
    toDate,
  }: CreateGuestReservationParams) {
    let guest = await this.usersService.findOneByEmail(email);

    if (!guest)
      guest = await this.usersService.createGuest({
        name,
        email,
        role: 'guest',
      });

    return await this.createReservation({ userId: guest.id, toDate });
  }
}
