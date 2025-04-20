import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
// import { UpdateClientDto } from './dto/update-client.dto';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressService } from 'src/address/address.service';
import { EncryptionService } from 'src/common/utils/encryption/encryption.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ClientResponseDto } from './dto/client-response.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly adressService: AddressService,
    private readonly encryptionService: EncryptionService,
  ) {}
  async create(createClientDto: CreateClientDto) {
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
      adress: this.adressService.create(createClientDto.adress),
    };

    const client = this.clientRepository.create(clientData);

    if (!client) {
      throw new BadRequestException('Error creating client');
    }

    await this.clientRepository.save(client);

    return client;
  }

  async findAllClients(
    pagination: PaginationDto,
  ): Promise<ClientResponseDto[]> {
    const { limit, offset } = pagination;
    const skip = (offset - 1) * limit;

    if (limit <= 0 || offset <= 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }
    if (limit > 50) {
      throw new BadRequestException('Limit cannot exceed 50');
    }

    const clients = await this.clientRepository.find({
      take: limit,
      skip: skip,
      relations: ['address'],
    });

    if (clients.length === 0) {
      throw new BadRequestException('No clients found');
    }

    return clients.map((client) => ({
      id: client.id,
      fullName: client.fullName,
      cpf: this.encryptionService.decrypt(client.cpf),
      phone: client.phone,
      phoneIsWhatsApp: client.phoneIsWhatsApp,
      profission: client.profission,
      civilStatus: client.civilStatus,
      address: {
        id: client.address.id,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        neighborhood: client.address.neighborhood,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
      },
    }));
  }

  async findOne(id: string): Promise<ClientResponseDto> {
    if (id == '' || id == null) {
      throw new BadRequestException('Invalid client ID');
    }

    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['address'],
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    const clientData: ClientResponseDto = {
      id: client.id,
      fullName: client.fullName,
      cpf: this.encryptionService.decrypt(client.cpf),
      phone: client.phone,
      phoneIsWhatsApp: client.phoneIsWhatsApp,
      profission: client.profission,
      civilStatus: client.civilStatus,
      address: {
        id: client.address.id,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        neighborhood: client.address.neighborhood,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
      },
    };
    return clientData;
  }

  // async update(id: string, updateClientDto: UpdateClientDto) {

  // }

  async remove(id: string) {
    if (id == '' || id == null) {
      throw new BadRequestException('Invalid client ID');
    }

    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['address'],
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    return await this.clientRepository.delete(id);
  }
}
