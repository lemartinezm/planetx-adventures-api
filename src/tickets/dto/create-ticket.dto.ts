import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(45)
  @ApiProperty()
  name: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  @MinDate(new Date(1740787200000))
  reservationDate: Date;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  @ApiProperty()
  seatCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  @ApiProperty()
  travelFrom: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  @ApiProperty()
  travelTo: string;
}
