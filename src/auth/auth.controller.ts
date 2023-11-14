import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { Prisma } from '@prisma/client';
import { RegisterUserRoleValidation } from './pipes/validation-pipe';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const userFound = await this.authService.findUserByEmail(email);
    if (!userFound) throw new BadRequestException();

    const passwordMatches = await bcrypt.compare(password, userFound.password);
    if (!passwordMatches) throw new UnauthorizedException();

    const payload = {
      name: userFound.name,
      email: userFound.email,
      role: userFound.role,
    };

    return {
      message: `Welcome ${payload.name}`,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
