import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class VoteEventDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'Vote value',
    maximum: 5,
    minimum: 1,
    example: 5,
  })
  vote: number;
}
