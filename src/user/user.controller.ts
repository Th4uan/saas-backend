import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Query,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import {
  ApiBody,
  ApiCookieAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoleEnum } from './enums/user-role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { RequestDisponibilityDto } from './dto/request-disponibility.dto';
import { Request } from 'express';
import { REQUEST_TOKEN_JWT_PAYLOAD } from 'src/auth/auth.constants';

@ApiTags('User')
@UseGuards(AuthTokenGuard)
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid Data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateUserDto })
  @ApiCookieAuth('jwt')
  @IsPublic()
  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }

    createUserDto.role = UserRoleEnum.Attendant;
    const user = await this.userService.createUser(createUserDto);

    return user;
  }
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid Data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateUserDto })
  @ApiCookieAuth('jwt')
  @Roles(UserRoleEnum.Admin)
  @Post('admin')
  async createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.createUser(createUserDto);

    if (!user) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  @ApiResponse({ status: 201, description: 'Doctor getted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid Data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @Get('doctors')
  async findAllDoctors(@Query() pagination: PaginationDto) {
    return this.userService.findAllDoctors(pagination);
  }

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

  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid Id' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    type: String,
  })
  @ApiCookieAuth('jwt')
  @Roles(UserRoleEnum.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch()
  async changeDisponibility(
    @Body() request: RequestDisponibilityDto,
    @Req() req: Request,
  ) {
    if (!request) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.changeDisponibility(
      (req[REQUEST_TOKEN_JWT_PAYLOAD] as { sub: string }).sub,
      request,
    );

    if (!user) {
      throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Disponibility changed successfully',
      user,
    };
  }
}
