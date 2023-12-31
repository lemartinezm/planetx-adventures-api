import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { user as UserModel } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async registerUser(
    user: RegisterUserDto,
  ): Promise<Pick<UserModel, 'id' | 'name' | 'email'>> {
    const existingUser = await this.findUserByEmail(user.email);
    if (existingUser)
      throw new BadRequestException('The email is already registered');
    return await this.prisma.user.create({
      data: user,
      select: { id: true, name: true, email: true },
    });
  }

  async findUserByEmail(email: string): Promise<Omit<UserModel, 'created_at'>> {
    return await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, password: true },
    });
  }
}
