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
import {
  ApiBody,
  ApiCookieAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@UseGuards(AuthTokenGuard)
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid Data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateUserDto })
  @IsPublic()
  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.createMember(createUserDto);

    return user;
  }
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid Data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateUserDto })
  @ApiCookieAuth('jwt')
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

  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 400, description: 'Invalid Id' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    type: String,
  })
  @ApiCookieAuth('jwt')
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
