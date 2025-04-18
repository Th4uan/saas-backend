import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HttpException } from '@nestjs/common';
import { HashingService } from 'src/auth/hashing/hashing.service';

describe('UserService', () => {
  let service: UserService;
  let hashingService: { hash: jest.Mock };
  let userRepository: {
    create: jest.Mock;
    save: jest.Mock;
    findOneBy: jest.Mock;
  };

  beforeEach(async () => {
    // Create mocks for dependencies
    userRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };

    hashingService = {
      hash: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: HashingService, useValue: hashingService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMember', () => {
    it('should create and return a member when valid data is provided', async () => {
      // Arrange
      const createUserDto = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'plainpassword',
      };

      const hashedPassword = 'hashedpassword';
      hashingService.hash.mockResolvedValue(hashedPassword);

      // The userData as defined in the service:
      const userData = {
        username: createUserDto.username,
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        role: 'attendant', // Simulando UserRoleEnum.Attendant
        password: hashedPassword,
      };

      const createdUser = { id: '1', ...userData } as User;
      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockResolvedValue(createdUser);

      // Act
      const result = await service.createMember(createUserDto);

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should throw an exception if user creation fails', async () => {
      // Arrange
      const createUserDto = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'plainpassword',
      };

      const hashedPassword = 'hashedpassword';
      hashingService.hash.mockResolvedValue(hashedPassword);

      // Simule falha na criação do usuário (create retornando undefined)
      userRepository.create.mockReturnValue(undefined);

      // Act & Assert
      await expect(service.createMember(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findUserById', () => {
    it('should return the user when found', async () => {
      // Arrange
      const userId = '1';
      const user = { id: userId, username: 'testuser' } as User;
      userRepository.findOneBy.mockResolvedValue(user);

      // Act
      const result = await service.findUserById(userId);

      // Assert
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(user);
    });
  });
});
