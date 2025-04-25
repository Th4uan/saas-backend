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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async createAdmin(createUserDto: CreateUserDto) {
    const pass = await this.hashingService.hash(createUserDto.password);
    const userData = {
      username: createUserDto.username,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      role: UserRoleEnum.Admin,
      password: pass,
    };

    const user: User = this.userRepository.create(userData);

    if (!user) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.save(user);

    return user;
  }

  async createDoctor(createUserDto: CreateUserDto) {
    const hashPass = await this.hashingService.hash(createUserDto.password);
    const userData = {
      username: createUserDto.username,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      role: UserRoleEnum.Attendant,
      password: hashPass,
    };

    const user: User = this.userRepository.create(userData);

    if (!user) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.save(user);

    return user;
  }

  async createMember(createUserDto: CreateUserDto) {
    const hashPass = await this.hashingService.hash(createUserDto.password);

    const userData = {
      username: createUserDto.username,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      role: UserRoleEnum.Attendant,
      password: hashPass,
    };

    const user: User = this.userRepository.create(userData);

    if (!user) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.save(user);

    return user;
  }

  async findAllDoctors(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;

    const skip = (offset - 1) * limit;

    if (limit <= 0 || offset <= 0) {
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

    if (!doctors) {
      throw new HttpException('No doctors found', HttpStatus.NOT_FOUND);
    }

    return doctors.map((doctor) => {
      return {
        id: doctor.id,
        fullName: doctor.fullName,
        email: doctor.email,
      };
    });
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

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
