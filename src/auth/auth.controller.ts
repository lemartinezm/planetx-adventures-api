import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { Prisma } from '@prisma/client';
import { RegisterUserRoleValidation } from './pipes/validation-pipe';
import * as bcrypt from 'bcrypt';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new RegisterUserRoleValidation())
  async register(@Body() user: RegisterUserDto) {
    try {
      const hashedPass = await bcrypt.hash(user.password, 10);
      const userWithHashedPass = { ...user, password: hashedPass };
      const userRegistered =
        await this.authService.registerUser(userWithHashedPass);
      return userRegistered;
    } catch (error) {
      this.logger.error('Error registering user');
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        this.logger.error(`Description: ${error.meta.target}`);
      else this.logger.error('Something went wrong');
      throw new BadRequestException();
    }
  }
}
