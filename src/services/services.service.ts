import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Between, Repository } from 'typeorm';
import { ClientsService } from 'src/clients/clients.service';
import { UserService } from 'src/user/user.service';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ResponseServiceDto } from './dto/response-service.dto';
import { mapServiceToDto } from './mapper/service.mapper';
import { PaymentService } from 'src/payment/payment.service';
import { UpdateServiceDto } from './dto/update-service.dto';
import { DateServiceDto } from './dto/date-service.dto';
import { AgreementService } from 'src/agreement/agreement.service';
import { EncryptionService } from 'src/common/utils/encryption/encryption.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly clientsService: ClientsService,
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
    private readonly agreementService: AgreementService,
    private readonly encryptionService: EncryptionService,
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

    const client = await this.clientsService.findOneClientEntity(
      createServiceDto.clientId,
    );

    if (!client) {
      throw new NotFoundException('Client Not Found');
    }

    const doctor = await this.userService.findUserById(
      createServiceDto.doctorId,
    );

    if (!doctor) {
      throw new NotFoundException('User Not Found');
    }

    const agreement = await this.agreementService.getAgreementById(
      createServiceDto.agreementId,
    );

    if (!agreement) {
      throw new NotFoundException('Agreement Not Found');
    }

    if (doctor.role !== UserRoleEnum.Doctor) {
      throw new UnauthorizedException('User is not a doctor');
    }

    const paymentData = {
      paymentMethod: createServiceDto.payment.paymentMethod,
      price: createServiceDto.payment.price,
    };

    const payment = await this.paymentService.createPayment(paymentData);

    if (!payment) {
      throw new BadRequestException('Error creating payment');
    }

    const data = {
      client: client,
      doctor: doctor,
      agreement: agreement,
      payments: payment,
      date: createServiceDto.date,
      status: createServiceDto.status,
      typeService: createServiceDto.typeService,
      recurrence: createServiceDto.recurrence,
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
    const { limit = 10, offset = 1 } = pagination;
    const skip = (offset - 1) * limit;

    const services = await this.serviceRepository.find({
      take: limit,
      skip: skip,
      relations: ['client', 'doctor', 'payments', 'agreement'],
    });

    const data: ResponseServiceDto[] = services.map((service) => {
      return mapServiceToDto(service, this.encryptionService);
    });

    if (data.length < 0) {
      throw new NotFoundException('No services found');
    }

    return data || [];
  }

  async findOneService(id: string) {
    if (id == '' || id == null) {
      throw new BadRequestException('Service ID is required');
    }

    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['client', 'doctor', 'payments', 'files'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async findOneServiceEntity(id: string): Promise<Service> {
    if (id == '' || id == null) {
      throw new BadRequestException('Service ID is required');
    }

    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['client', 'doctor', 'payments'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  // async findAllServicesByDate(dateDto: DateServiceDto) {
  //   if (!dateDto) {
  //     throw new BadRequestException('Date is required');
  //   }

  //   const [startYear, startMonth, startDay] = dateDto.initDate.split('-').map(Number);
  //   const [endYear, endMonth, endDay] = dateDto.endDate.split('-').map(Number);

  //   const startDate = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
  //   const endDate = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);

  //   const services = await this.serviceRepository.find({
  //     where: {
  //       date: Between(startDate, endDate),
  //     },
  //     relations: ['client', 'doctor', 'payments', 'agreement'],
  //   });

  //   const data: ResponseServiceDto[] = services.map((service) => {
  //     return mapServiceToDto(service);
  //   });

  //   if (data.length <= 0) {
  //     throw new NotFoundException('No services found');
  //   }

  //   return data;
  // }

  async updateServiceStatus(id: string, update: UpdateServiceDto) {
    if (id == '' || id == null) {
      throw new BadRequestException('Service ID is required');
    }

    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['client', 'doctor', 'payments'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (update.status) {
      service.status = update.status;
    }

    if (update.date) {
      service.date = new Date(update.date);
    }

    await this.serviceRepository.save(service);

    return service;
  }

  async findAllServicesByDate(dateDto: DateServiceDto) {
    if (!dateDto) {
      throw new BadRequestException('Date is required');
    }

    const startDate = new Date(dateDto.initDate);
    const endDate = new Date(dateDto.endDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const services = await this.serviceRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['client', 'doctor', 'payments', 'agreement'],
    });

    const data: ResponseServiceDto[] = services.map((service) => {
      return mapServiceToDto(service, this.encryptionService);
    });

    if (data.length < 0) {
      throw new NotFoundException('No services found');
    }

    return data || [];
  }

  async updateServiceRecords(id: string, records: string[]): Promise<Service> {
    if (id === '' || id === null) {
      throw new BadRequestException('ID do serviço é obrigatório');
    }

    const service = await this.findOneServiceEntity(id);

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    service.records = records;
    await this.serviceRepository.save(service);
    return service;
  }
}
