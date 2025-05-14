import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
  UseGuards,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import {
  ApiBody,
  ApiCookieAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateServiceDto } from './dto/update-service.dto';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { DateServiceDto } from './dto/date-service.dto';

@ApiCookieAuth('jwt')
@UseGuards(AuthTokenGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Service created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid service data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client or User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not a doctor',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Invalid token',
  })
  @ApiBody({
    type: CreateServiceDto,
    description: 'Service data',
  })
  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    if (!createServiceDto) {
      throw new BadRequestException('Invalid service data');
    }
    return await this.servicesService.create(createServiceDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of services',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid pagination data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Invalid token',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Page Number',
    type: Number,
  })
  @IsPublic()
  @Get()
  async findAllServices(@Query() paginationDto: PaginationDto) {
    if (!paginationDto) {
      throw new BadRequestException('Invalid pagination data');
    }
    return await this.servicesService.findAllServices(paginationDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid service ID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Invalid token',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Service ID',
    type: String,
  })
  @Get(':id')
  async findOneService(@Param('id') id: string) {
    if (id == '' || id == null) {
      throw new BadRequestException('Service ID is required');
    }
    return await this.servicesService.findOneService(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service getted by day',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid date',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Invalid token',
  })
  @Get('day')
  // async findAllServicesByDay() {
  //   return this.servicesService.findAllServiceByDay();
  // }
  @Patch(':id')
  async updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    if (id == '' || id == null) {
      throw new BadRequestException('Service ID is required');
    }
    const data = await this.servicesService.updateServiceStatus(
      id,
      updateServiceDto,
    );

    return {
      message: 'Service updated successfully',
      doctorUsername: data.doctor.username,
      data,
    };
  }

  @Post('date')
  async findAllServicesByDate(@Body() dateDto: DateServiceDto) {
    if (!dateDto) {
      throw new BadRequestException('Date is required');
    }
    return await this.servicesService.findAllServicesByDate(dateDto);
  }
}
