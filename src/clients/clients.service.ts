import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
// import { UpdateClientDto } from './dto/update-client.dto';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptionService } from 'src/common/utils/encryption/encryption.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { mapperClientToDto } from './mapper/clients.mapper';
import { Service } from 'src/services/entities/service.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly encryptionService: EncryptionService,
  ) {}
  async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    if (!createClientDto) {
      throw new BadRequestException('Invalid client data');
    }

    const clientData = {
      fullName: createClientDto.fullName,
      cpf: this.encryptionService.encrypt(createClientDto.cpf),
      phone: createClientDto.phone,
      phoneIsWhatsApp: createClientDto?.phoneIsWhatsApp,
      profission: createClientDto.profission,
      civilStatus: createClientDto.civilStatus,
      rg: createClientDto.rg,
      birthDate: createClientDto.birthDate,
      scholarity: createClientDto.scholarity,
      nationality: createClientDto.nationality,
      address: createClientDto.address,
    };

    const client = this.clientRepository.create(clientData);

    if (!client) {
      throw new BadRequestException('Error creating client');
    }

    await this.clientRepository.save(client);

    const data: ClientResponseDto = mapperClientToDto(client);

    return data;
  }

  async findAllClients(
    pagination: PaginationDto,
  ): Promise<ClientResponseDto[]> {
    const { limit = 10, offset = 1 } = pagination;
    const skip = (offset - 1) * limit;

    if (limit < 0 || offset < 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }
    if (limit > 50) {
      throw new BadRequestException('Limit cannot exceed 50');
    }

    const clients = await this.clientRepository.find({
      take: limit,
      skip: skip,
    });

    const clientData: ClientResponseDto[] = clients.map((client) =>
      mapperClientToDto(client),
    );
    return clientData || [];
  }
  async findOneClientEntity(id: string): Promise<Client> {
    if (id == '' || id == null) {
      throw new BadRequestException('Invalid client ID');
    }

    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }
    client.cpf = this.encryptionService.decrypt(client.cpf);

    return client;
  }

  async findOneClient(id: string): Promise<ClientResponseDto> {
    if (id == '' || id == null) {
      throw new BadRequestException('Invalid client ID');
    }

    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    client.cpf = this.encryptionService.decrypt(client.cpf);
    return mapperClientToDto(client);
  }

  // async update(id: string, updateClientDto: UpdateClientDto) {

  // }

  async remove(id: string) {
    if (id == '' || id == null) {
      throw new BadRequestException('Invalid client ID');
    }

    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    return await this.clientRepository.delete(id);
  }

  async getServicesByClientId(clientId: string): Promise<Service[]> {
    if (clientId == '' || clientId == null) {
      throw new BadRequestException('Invalid client ID');
    }

    const client = await this.clientRepository.findOne({
      where: { id: clientId },
      relations: [
        'services',
        'services.doctor',
        'services.agreement',
        'services.payments',
        'services.files',
      ],
    });

    const services = client?.services;

    return services || [];
  }
}
