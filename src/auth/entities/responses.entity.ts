import { ApiProperty } from '@nestjs/swagger';

export class CreatedResponse {
  @ApiProperty({ description: "User's id", example: 1 })
  id: number;

  @ApiProperty({ description: "User's name", example: 'John Doe' })
  name: string;

  @ApiProperty({ description: "User's email", example: 'example@email.com' })
  email: string;
}

export class BadRequestResponse {
  @ApiProperty({
    description: 'Error message',
    example: ['password should not be empty', 'password must be a string'],
    isArray: true,
    required: false,
  })
  message: string | string[];

  @ApiProperty({ description: 'Error message', example: 'Bad Request' })
  error: string;

  @ApiProperty({ description: 'Error code', example: 400 })
  statusCode: number;
}

export class OkResponse {
  @ApiProperty({ description: 'Success message', example: 'Welcome John Doe' })
  message: string;

  @ApiProperty({
    description: 'Token obtained',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  access_token: string;
}

export class UnauthorizedResponse {
  @ApiProperty({ description: 'Message', example: 'Unauthorized' })
  message: string;

  @ApiProperty({ description: 'Status code number', example: 401 })
  statusCode: number;
}
