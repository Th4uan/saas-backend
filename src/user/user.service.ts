import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { UserRoleEnum } from './enums/user-role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { RequestDisponibilityDto } from './dto/request-disponibility.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const pass = await this.hashingService.hash(createUserDto.password);
    const userData = {
      username: createUserDto.username,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      role: createUserDto.role,
      password: pass,
    };

    const user: User = this.userRepository.create(userData);

    if (!user) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.save(user);

    return user;
  }

  async findAllDoctors(pagination: PaginationDto) {
    const { limit = 10, offset = 1 } = pagination;
    const skip = (offset - 1) * limit;

    if (limit <= 0 || offset < 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }
    if (limit > 50) {
      throw new BadRequestException('Limit cannot exceed 50');
    }

    const doctors = await this.userRepository.find({
      skip: skip,
      take: limit,
      where: {
        role: UserRoleEnum.Doctor,
      },
    });

    const doctorData = doctors.map((doctor) => {
      return {
        id: doctor.id,
        username: doctor.username,
        email: doctor.email,
        disponibility: doctor.disponibility,
      };
    });

    return doctorData || [];
  }

  async getServicesByDoctorId(doctorId: string) {
    const doctor = await this.userRepository.findOne({
      where: {
        id: doctorId,
      },
      relations: ['services'],
    });
    if (!doctor) {
      throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
    }
    const services = doctor.services;
    return services || [];
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException(
        'User with this id not exists',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const deletedUser = await this.userRepository.delete(id);

    return deletedUser;
  }

  async changeDisponibility(id: string, request: RequestDisponibilityDto) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.userRepository.update(id, {
      disponibility: request.disponibility,
    });

    return updatedUser;
  }

  async findAllUsers(pagination: PaginationDto) {
    const { limit = 10, offset = 1 } = pagination;
    const skip = (offset - 1) * limit;

    if (limit <= 0 || offset < 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }
    if (limit > 50) {
      throw new BadRequestException('Limit cannot exceed 50');
    }

    const users = await this.userRepository.find({
      skip: skip,
      take: limit,
    });

    return users || [];
  }
}
