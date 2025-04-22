import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { ClientsService } from 'src/clients/clients.service';
import { UserService } from 'src/user/user.service';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ResponseServiceDto } from './dto/response-service.dto';

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
      throw new UnauthorizedException('User is not a doctor');
    }

    const data = {
      client: client,
      doctor: doctor,
      date: createServiceDto.date,
      time: createServiceDto.time,
      status: createServiceDto.status,
      typeService: createServiceDto.typeService,
    };

    const service = this.serviceRepository.create(data);

    await this.serviceRepository.save(service);

    return service;
  }

  async findAllServices(
    pagination: PaginationDto,
  ): Promise<ResponseServiceDto[]> {
    if (!pagination) {
      throw new BadRequestException('Pagination data is required');
    }
    const { limit = 10, offset = 0 } = pagination;
    const skip = (offset - 1) * limit;

    const services = await this.serviceRepository.find({
      take: limit,
      skip: skip,
      relations: ['client', 'doctor'],
    });

    if (!services) {
      throw new NotFoundException('No services found');
    }

    const data: ResponseServiceDto[] = services.map((service) => {
      return {
        id: service.id,
        client: {
          id: service.client.id,
          fullName: service.client.fullName,
          phone: service.client.phone,
          phoneIsWhatsApp: service.client.phoneIsWhatsApp,
        },
        doctor: {
          id: service.doctor.id,
          fullName: service.doctor.fullName,
          email: service.doctor.email,
        },
        date: service.date,
        time: service.time,
        status: service.status,
        typeService: service.typeService,
      };
    });

    if (data.length <= 0) {
      throw new NotFoundException('No services found');
    }

    return data;
  }

  async findOneService(id: string): Promise<ResponseServiceDto> {
    if (id == '' || id == null) {
      throw new BadRequestException('Service ID is required');
    }

    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['client', 'doctor'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const data: ResponseServiceDto = {
      id: service.id,
      client: {
        id: service.client.id,
        fullName: service.client.fullName,
        phone: service.client.phone,
        phoneIsWhatsApp: service.client.phoneIsWhatsApp,
      },
      doctor: {
        id: service.doctor.id,
        fullName: service.doctor.fullName,
        email: service.doctor.email,
      },
      date: service.date,
      time: service.time,
      status: service.status,
      typeService: service.typeService,
    };

    return data;
  }
}
