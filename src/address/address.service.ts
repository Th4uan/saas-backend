import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}
  async create(createAddressDto: CreateAddressDto) {
    if (!createAddressDto) {
      throw new BadRequestException('Invalid address data');
    }

    const adressData = {
      street: createAddressDto.street,
      number: createAddressDto.number,
      neighborhood: createAddressDto.neighborhood,
      city: createAddressDto.city,
      state: createAddressDto.state,
      zipCode: createAddressDto.zipCode,
      complement: createAddressDto.complement,
    };

    const data: Address = this.addressRepository.create(adressData);

    if (!data) {
      throw new BadRequestException('Invalid Address Data');
    }

    await this.addressRepository.save(data);

    return data;
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
