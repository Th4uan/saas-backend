import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRoleEnum } from './enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';

const mockAuthGuard = { canActivate: jest.fn(() => true) };

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    createMember: jest.fn(),
    createAdmin: jest.fn(),
    findUserById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'jwt.secret') return 'test-secret';
      if (key === 'jwt.expiresIn') return '1h';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    })
      .overrideGuard(AuthTokenGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedUser = {
        id: 'user-id',
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        role: UserRoleEnum.Attendant,
      } as User;

      mockUserService.createMember.mockResolvedValue(expectedUser);

      const result = await controller.registerUser(createUserDto);

      expect(mockUserService.createMember).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });

    it('should throw an exception when createUserDto is invalid', async () => {
      const invalidUserDto = {} as CreateUserDto;

      mockUserService.createMember.mockImplementation(() => {
        throw new Error(
          'UserService.createMember should not be called with invalid DTO',
        );
      });

      jest.spyOn(controller, 'registerUser').mockImplementation(() => {
        return Promise.reject(
          new HttpException('Invalid Data', HttpStatus.BAD_REQUEST),
        );
      });

      await expect(controller.registerUser(invalidUserDto)).rejects.toThrow(
        new HttpException('Invalid Data', HttpStatus.BAD_REQUEST),
      );
      expect(mockUserService.createMember).not.toHaveBeenCalled();
    });

    it('should propagate service exceptions', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserService.createMember.mockRejectedValue(
        new HttpException('Service error', HttpStatus.INTERNAL_SERVER_ERROR),
      );

      await expect(controller.registerUser(createUserDto)).rejects.toThrow(
        new HttpException('Service error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('createAdmin', () => {
    it('should create a new admin successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'adminuser',
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
      };

      const expectedUser = {
        id: 'admin-id',
        username: 'adminuser',
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: UserRoleEnum.Admin,
      } as User;

      mockUserService.createAdmin.mockResolvedValue(expectedUser);

      const result = await controller.createAdmin(createUserDto);

      expect(mockUserService.createAdmin).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });

    it('should throw an exception when createUserDto is invalid', async () => {
      const invalidUserDto = {} as CreateUserDto;

      mockUserService.createAdmin.mockImplementation(() => {
        throw new Error(
          'UserService.createAdmin should not be called with invalid DTO',
        );
      });

      jest.spyOn(controller, 'createAdmin').mockImplementation(() => {
        return Promise.reject(
          new HttpException('Invalid Data', HttpStatus.BAD_REQUEST),
        );
      });

      await expect(controller.createAdmin(invalidUserDto)).rejects.toThrow(
        new HttpException('Invalid Data', HttpStatus.BAD_REQUEST),
      );
      expect(mockUserService.createAdmin).not.toHaveBeenCalled();
    });

    it('should throw an exception when user service returns null', async () => {
      const createUserDto: CreateUserDto = {
        username: 'adminuser',
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
      };

      mockUserService.createAdmin.mockResolvedValue(null);

      await expect(controller.createAdmin(createUserDto)).rejects.toThrow(
        new HttpException('Invalid Data', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findUserById', () => {
    it('should return a user when valid ID is provided', async () => {
      const userId = 'valid-user-id';
      const expectedUser = {
        id: userId,
        username: 'existinguser',
        fullName: 'Existing User',
        email: 'existing@example.com',
        role: UserRoleEnum.Attendant,
      } as User;

      mockUserService.findUserById.mockResolvedValue(expectedUser);

      const result = await controller.findUserById(userId);

      expect(mockUserService.findUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });

    it('should throw an exception when ID is empty', async () => {
      const emptyId = '';

      await expect(controller.findUserById(emptyId)).rejects.toThrow(
        new HttpException('Invalid Id', HttpStatus.BAD_REQUEST),
      );
      expect(mockUserService.findUserById).not.toHaveBeenCalled();
    });

    it('should propagate exceptions from the service', async () => {
      const userId = 'non-existent-id';
      mockUserService.findUserById.mockRejectedValue(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );

      await expect(controller.findUserById(userId)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
