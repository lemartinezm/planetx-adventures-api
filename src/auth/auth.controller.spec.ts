import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  const prismaService = { user: { findUnique: jest.fn(), create: jest.fn() } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.SECRET_JWT,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register tests', () => {
    it('should successfully register a user with valid name, email, and password', async () => {
      const user: RegisterUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const expectedUser = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      const hashedPass = 'mockHashedPass';
      const userWithHashedPass = { ...user, password: hashedPass };
      jest.spyOn(authService, 'registerUser').mockResolvedValue(expectedUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPass);

      const result = await authController.register(user);

      expect(result).toEqual(expectedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 10);
      expect(authService.registerUser).toHaveBeenCalledWith(userWithHashedPass);
    });

    it('should throw a BadRequestException if user tries to register with an existing email', async () => {
      const user: RegisterUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const hashedPass = 'mockedHashPass';
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPass);
      jest.spyOn(authService, 'registerUser').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Email already exists', {
          code: 'Code',
          clientVersion: '0.0.1',
          meta: { target: ['email_UNIQUE'] },
        }),
      );

      const result = authController.register(user);
      await expect(result).rejects.toThrow(BadRequestException);
    });

    it('should throw a BadRequestException for unknown errors', async () => {
      const user: RegisterUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const hashedPass = 'mockedHashPass';
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPass);
      jest
        .spyOn(authService, 'registerUser')
        .mockRejectedValue(new Error('Unknown error'));

      const result = authController.register(user);
      await expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('login tests', () => {
    it('should successfully login with valid email and password', async () => {
      const loginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userFound = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        password: 'mockedHashedPasswrod...',
      };
      const expectedResult = {
        message: `Welcome ${userFound.name}`,
        access_token: 'mockedAccessToken',
      };

      jest.spyOn(authService, 'findUserByEmail').mockResolvedValue(userFound);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockReturnValue(Promise.resolve(expectedResult.access_token));

      const result = await authController.login(loginUserDto);

      expect(result).toEqual(expectedResult);
      expect(authService.findUserByEmail).toHaveBeenCalledWith(
        loginUserDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginUserDto.password,
        userFound.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        name: userFound.name,
        email: userFound.email,
        role: userFound.role,
      });
    });

    it('should throw a BadRequestException if user tries to login with an invalid email', async () => {
      const loginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(authService, 'findUserByEmail').mockResolvedValue(null);

      const result = authController.login(loginUserDto);
      await expect(result).rejects.toThrow(BadRequestException);
    });

    it('should throw a UnauthorizedException if user tries to login with an invalid password', async () => {
      const loginUserDto = {
        email: 'test@example.com',
        password: 'invalidPass',
      };
      const userFound = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        password: 'mockedHashedPasswrod...',
      };

      jest.spyOn(authService, 'findUserByEmail').mockResolvedValue(userFound);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      const result = authController.login(loginUserDto);
      await expect(result).rejects.toThrow(UnauthorizedException);
    });
  });
});
