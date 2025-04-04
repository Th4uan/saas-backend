import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './configs/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-interface.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('User or password invalid');
    }

    const isPasswordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('User or password invalid');
    }
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      aud: this.config.aud,
      iss: this.config.iss,
      secret: this.config.secret,
      exp: this.config.jwtTtl,
    };

    const acessToken = await this.jwtService.signAsync(payload);

    return acessToken;
  }
}
