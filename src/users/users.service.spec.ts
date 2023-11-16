import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

describe('UserService', () => {
  let usersService: UsersService;
  const prismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create user tests', () => {
    it('should create a new user with valid input data', async () => {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashedPass',
      };
      const expectedUser = {
        id: 1,
        name: user.name,
        email: user.email,
      };

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(expectedUser);
      const createdUser = await usersService.create(user);
      expect(createdUser).toHaveProperty('id');
      expect(createdUser).toHaveProperty('name', user.name);
      expect(createdUser).toHaveProperty('email', user.email);
      expect(createdUser).not.toHaveProperty('password');
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: user,
        select: { id: true, name: true, email: true },
      });
    });

    it('should handle creating multiple users with different input data', async () => {
      const user1 = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const user2 = {
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        password: 'password456',
      };
      const expectedUser1 = {
        id: 1,
        name: user1.name,
        email: user1.email,
      };
      const expectedUser2 = {
        id: 2,
        name: user2.name,
        email: user2.email,
      };

      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(expectedUser1);
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(expectedUser2);

      const createdUser1 = await usersService.create(user1);
      const createdUser2 = await usersService.create(user2);
      expect(createdUser1).toHaveProperty('id');
      expect(createdUser1).toHaveProperty('name', user1.name);
      expect(createdUser1).toHaveProperty('email', user1.email);
      expect(createdUser2).toHaveProperty('id');
      expect(createdUser2).toHaveProperty('name', user2.name);
      expect(createdUser2).toHaveProperty('email', user2.email);
    });
  });

  describe('find user tests', () => {
    it('should return an array of users with their id, name, and email', async () => {
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await usersService.findAll();

      expect(result).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('find one user tests', () => {
    it('should return a user object with the specified id, name and email', async () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await usersService.findOne(1);
      expect(result).toEqual(user);
    });
  });

  describe('update user tests', () => {
    it('should update a user with valid id and partial data', async () => {
      const id = 1;
      const partialUserData = { name: 'John Doe' };
      const updatedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      };
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await usersService.update(id, partialUserData);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: partialUserData,
        select: { id: true, name: true, email: true },
      });
      expect(result).toEqual(updatedUser);
    });
  });
});
