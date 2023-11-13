import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { user } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Pick<user, 'id' | 'name' | 'email'>[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Pick<user, 'id' | 'name' | 'email'>> {
    try {
      const userCreated = await this.usersService.create(createUserDto);
      return userCreated;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Pick<user, 'id' | 'name' | 'email'>> {
    const userFound = await this.usersService.findOne(id);
    if (!userFound) throw new NotFoundException();
    return userFound;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: Partial<CreateUserDto>,
  ): Promise<Pick<user, 'id' | 'name' | 'email'>> {
    const userUpdated = await this.usersService.update(id, user);
    if (!userUpdated) throw new NotFoundException();
    return userUpdated;
  }
}
