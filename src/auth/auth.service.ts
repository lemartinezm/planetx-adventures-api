import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { user as UserModel } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async registerUser(
    user: RegisterUserDto,
  ): Promise<Pick<UserModel, 'id' | 'name' | 'email'>> {
    return this.prisma.user.create({
      data: user,
      select: { id: true, name: true, email: true },
    });
  }
}
