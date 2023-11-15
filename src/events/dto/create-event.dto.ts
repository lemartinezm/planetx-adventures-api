import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'Event name', example: 'This is an event name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(40)
  @ApiProperty({
    description: 'Event description',
    example: 'This is an event description',
  })
  description: string;
}
