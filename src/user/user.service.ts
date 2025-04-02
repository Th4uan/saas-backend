import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashPass = await this.hashingService.hash(createUserDto.password);

    const userData = {
      username: createUserDto.username,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: hashPass,
    };

    const user: User = this.userRepository.create(userData);

    await this.userRepository.save(user);

    return user;
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

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
