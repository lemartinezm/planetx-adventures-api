import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({ description: "User's name", example: 'John Will' })
  name: string;

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
