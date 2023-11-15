import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ description: 'Comment', example: 'This is a comment' })
  comment: string;
}
