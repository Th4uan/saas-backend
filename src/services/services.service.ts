import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { ClientsService } from 'src/clients/clients.service';
import { UserService } from 'src/user/user.service';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
// import { PaginationDto } from 'src/common/dtos/pagination.dto';
// import { ResponseServiceDto } from './dto/response-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly clientsService: ClientsService,
    private readonly userService: UserService,
  ) {}
  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    if (!createServiceDto) {
      throw new BadRequestException('Service data is required');
    }

    if (!createServiceDto.clientId) {
      throw new NotFoundException('Client Not Found');
    }

    if (!createServiceDto.doctorId) {
      throw new NotFoundException('User Not Found');
    }

    const client = await this.clientsService.findOne(createServiceDto.clientId);

    if (!client) {
      throw new NotFoundException('Client Not Found');
    }

    const doctor = await this.userService.findUserById(
      createServiceDto.doctorId,
    );

    if (!doctor) {
      throw new NotFoundException('User Not Found');
    }

    if (doctor.role !== UserRoleEnum.Doctor) {
      throw new BadRequestException('User is not a doctor');
    }

    const data = {
      clientId: createServiceDto.clientId,
      doctorId: createServiceDto.doctorId,
      date: createServiceDto.date,
      time: createServiceDto.time,
      status: createServiceDto.status,
      typeService: createServiceDto.typeService,
    };

    const service = this.serviceRepository.create(data);

    await this.serviceRepository.save(service);

    return service;
  }

  // async findAllServices(
  //   pagination: PaginationDto,
  // ): Promise<ResponseServiceDto[]> {
  //   if (!pagination) {
  //     throw new BadRequestException('Pagination data is required');
  //   }
  //   const { limit = 10, offset = 0 } = pagination;

  //   const services = await this.serviceRepository.find({
  //     take: limit,
  //     skip: offset,
  //   });

  //   if (!services) {
  //     throw new NotFoundException('No services found');
  //   }

  //   return data;
  // }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }
}
