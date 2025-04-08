import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { isAdminGuard } from 'src/common/guards/is-admin.guard';

@UseGuards(AuthTokenGuard)
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.createMember(createUserDto);

    return user;
  }

  @UseGuards(isAdminGuard)
  @Post('admin')
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.createAdmin(createUserDto);

    if (!user) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    if (id == '') {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }
    const user: User = await this.userService.findUserById(id);

    return user;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
