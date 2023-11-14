import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  const prismaService = { user: { findUnique: jest.fn(), create: jest.fn() } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register tests', () => {
    it('should register a new user with valid name, email, and password', async () => {
      const user: RegisterUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const expectedUser = {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      jest.spyOn(authService, 'findUserByEmail').mockReturnValue(null);
      jest.spyOn(prismaService.user, 'create').mockReturnValue(expectedUser);

      const result = await authService.registerUser(user);

      expect(result).toEqual(expectedUser);
      expect(authService.findUserByEmail).toHaveBeenCalledWith(user.email);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: user,
        select: { id: true, name: true, email: true },
      });
    });

    it('should allow registration of multiple users with different emails', async () => {
      const user1: RegisterUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const user2: RegisterUserDto = {
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        password: 'password456',
      };
      const expectedUser1 = {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
      };
      const expectedUser2 = {
        id: '2',
        name: 'Jane Smith',
        email: 'janesmith@example.com',
      };
      jest.spyOn(authService, 'findUserByEmail').mockReturnValue(null);
      jest
        .spyOn(prismaService.user, 'create')
        .mockReturnValueOnce(expectedUser1);
      jest
        .spyOn(prismaService.user, 'create')
        .mockReturnValueOnce(expectedUser2);

      const result1 = await authService.registerUser(user1);
      const result2 = await authService.registerUser(user2);

      expect(result1).toEqual(expectedUser1);
      expect(result2).toEqual(expectedUser2);
    });

    it('should throw BadRequestException if email is already registered', async () => {
      const user: RegisterUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const existingUser = {
        name: 'Jane Smith',
        email: 'johndoe@example.com',
        role: 'user',
        password: 'password456',
      };

      jest
        .spyOn(authService, 'findUserByEmail')
        .mockReturnValue(Promise.resolve(existingUser));

      const result = authService.registerUser(user);
      await expect(result).rejects.toThrow(BadRequestException);
      expect(authService.findUserByEmail).toHaveBeenCalledWith(user.email);
    });
  });

  describe('login tests', () => {
    it('should return a user object when a valid email is provided', async () => {
      const email = 'test@example.com';
      const expectedValue = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password',
        role: 'user',
      };
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockReturnValue(expectedValue);

      const result = await authService.findUserByEmail(email);
      expect(result).toEqual(expectedValue);
      expect(prismaService.user.findUnique).toHaveBeenCalled();
    });

    it('should return only the name, email, role, and password fields of the user object', async () => {
      const email = 'test@example.com';
      const expectedValue = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password',
        role: 'user',
      };
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockReturnValue(expectedValue);

      const result = await authService.findUserByEmail(email);
      expect(result).toEqual(expectedValue);
      expect(Object.keys(result)).toEqual(Object.keys(expectedValue));
    });

    it('should return null when no user is found with the provided email', async () => {
      const email = 'nonexistent@example.com';
      jest.spyOn(prismaService.user, 'findUnique').mockReturnValue(null);

      const result = await authService.findUserByEmail(email);
      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalled();
    });
  });
});
