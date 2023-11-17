import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { PrismaService } from '../prisma.service';
import { user as UserModel } from '@prisma/client';
import { CreateGuestParams } from './interfaces/users.service';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<Pick<UserModel, 'id' | 'name' | 'email'>> {
    return await this.prisma.user.create({
      data: user,
      select: { id: true, name: true, email: true },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
  }

  async findOne(id: number): Promise<Pick<UserModel, 'id' | 'name' | 'email'>> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  }

  async findOneByEmail(
    email: string,
  ): Promise<Pick<UserModel, 'id' | 'name' | 'email'>> {
    return await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });
  }

  async update(
    id: number,
    user: Partial<User>,
  ): Promise<Pick<UserModel, 'id' | 'name' | 'email'>> {
    return await this.prisma.user.update({
      where: { id },
      data: user,
      select: { id: true, name: true, email: true },
    });
  }

  async createGuest({ name, role, email }: CreateGuestParams) {
    const hashedPass = await bcrypt.hash(randomUUID(), 10);
    const guestUser = { name, role, email, password: hashedPass };
    return await this.prisma.user.create({
      data: guestUser,
      select: { id: true, name: true, email: true },
    });
  }
}
