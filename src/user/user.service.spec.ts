import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HttpException } from '@nestjs/common';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoleEnum } from './enums/user-role.enum';

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

  describe('createUser', () => {
    it('should create and return an attendant user when valid data is provided', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'plainpassword',
        role: UserRoleEnum.Attendant,
      };

      const hashedPassword = 'hashedpassword';
      hashingService.hash.mockResolvedValue(hashedPassword);

      const userData = {
        username: createUserDto.username,
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        role: createUserDto.role,
        password: hashedPassword,
      };

      const createdUser = { id: '1', ...userData } as User;
      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockResolvedValue(createdUser);

      // Act
      const result = await service.createUser(createUserDto);

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should create and return an admin user when valid data is provided', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'adminuser',
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'plainpassword',
        role: UserRoleEnum.Admin,
      };

      const hashedPassword = 'hashedpassword';
      hashingService.hash.mockResolvedValue(hashedPassword);

      const userData = {
        username: createUserDto.username,
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        role: createUserDto.role,
        password: hashedPassword,
      };

      const createdUser = { id: '1', ...userData } as User;
      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockResolvedValue(createdUser);

      // Act
      const result = await service.createUser(createUserDto);

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should throw an exception if user creation fails', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'plainpassword',
        role: UserRoleEnum.Attendant,
      };

      const hashedPassword = 'hashedpassword';
      hashingService.hash.mockResolvedValue(hashedPassword);

      // Simule falha na criação do usuário (create retornando undefined)
      userRepository.create.mockReturnValue(undefined);

      // Act & Assert
      await expect(service.createUser(createUserDto)).rejects.toThrow(
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

    it('should throw an exception if user is not found', async () => {
      // Arrange
      const userId = '999';
      userRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findUserById(userId)).rejects.toThrow(HttpException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });
});
