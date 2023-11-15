import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "User's email", example: 'example@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: "User's password", example: 'mypassword' })
  password: string;
}
