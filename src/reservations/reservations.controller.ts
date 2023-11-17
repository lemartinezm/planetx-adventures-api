import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { AuthOrGuestGuard } from 'src/auth/auth.guard';
import { JwtUser } from 'src/users/interfaces/user.interface';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
@ApiTags('Reservations')
@UsePipes(new ValidationPipe({ transform: true }))
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(AuthOrGuestGuard)
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @Request() request: Request & { user: JwtUser | null },
  ) {
    const { toDate, email, name } = createReservationDto;
    if (request.user) {
      const { id: userId } = request.user;
      return this.reservationsService.createReservation({
        userId,
        toDate,
      });
    } else {
      return await this.reservationsService.createGuestReservation({
        name,
        email,
        toDate,
      });
    }
  }
}
