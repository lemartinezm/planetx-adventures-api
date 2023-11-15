import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(40)
  description: string;
}
