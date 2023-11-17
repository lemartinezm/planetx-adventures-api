import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateReservationDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  toDate: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(64)
  email: string;
  // TODO: when request.user is not found should validate name and email
}
