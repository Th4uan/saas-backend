import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './configs/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Jwt, JwtPayload } from './interfaces/jwt-interface.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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

    const acessToken = this.signJwtAsync(user);
    const refreshToken = this.generateRefreshToken(user);

    const tokens = await Promise.all([acessToken, refreshToken]);

    const hashedRefreshToken = await this.hashingService.hash(tokens[1]);

    await this.cacheManager.set(
      `refresh_token:${user.id}`,
      hashedRefreshToken,
      this.config.jwtTtlRefresh,
    );

    await this.cacheManager.get(`refresh_token:${user.id}`);
    return { tokens, user };
  }

  async refreshToken(refreshToken: RefreshTokenDto) {
    const invalidToken = 'Invalid or ExpiredRefresh Token';
    try {
      const sub: Jwt = await this.jwtService.verifyAsync(
        refreshToken.refreshToken,
        this.config,
      );

      const user = await this.userRepository.findOneBy({
        id: sub.sub,
      });

      if (!user) {
        throw new Error(invalidToken);
      }

      const cacheToken = await this.cacheManager.get<string>(
        `refresh_token:${user.id}`,
      );

      if (!cacheToken) {
        throw new Error(invalidToken);
      }
      const isTokenValid = await this.hashingService.compare(
        refreshToken.refreshToken,
        cacheToken,
      );
      if (isTokenValid) {
        throw new Error(invalidToken);
      }

      const newRefreshToken = await this.generateRefreshToken(user);

      const hashedRefreshToken =
        await this.hashingService.hash(newRefreshToken);

      await this.cacheManager.del(`refresh_token:${user.id}`);

      await this.cacheManager.set(
        `refresh_token:${user.id}`,
        hashedRefreshToken,
        this.config.jwtTtlRefresh,
      );

      return [this.signJwtAsync(user), newRefreshToken];
    } catch {
      throw new UnauthorizedException(invalidToken);
    }
  }

  async logout(id: string): Promise<boolean> {
    const refreshTokenDeleted = await this.cacheManager.del(
      `refresh_token:${id}`,
    );
    return refreshTokenDeleted;
  }

  async checkToken(id: string): Promise<string> {
    const token = await this.cacheManager.get<string>(`refresh_token:${id}`);
    if (!token) {
      throw new UnauthorizedException('Invalid or Expired Refresh Token');
    }
    return token;
  }

  private async signJwtAsync(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      aud: this.config.aud,
      iss: this.config.iss,
      secret: this.config.secret,
      exp: this.config.jwtTtl,
    };

    const acessToken = await this.jwtService.signAsync(payload);
    return acessToken;
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const payload: Jwt = {
      sub: user.id,
      aud: this.config.aud,
      iss: this.config.iss,
      secret: this.config.secret,
      exp: this.config.jwtTtlRefresh,
    };

    const acessToken = await this.jwtService.signAsync(payload);
    return acessToken;
  }
}
