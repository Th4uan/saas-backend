import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
// import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ClientResponseDto } from './dto/client-response.dto';

@ApiTags('clients')
@ApiCookieAuth('jwt')
@UseGuards(AuthTokenGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid client data',
  })
  @ApiResponse({
    status: 400,
    description: 'Error creating client',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBody({
    type: CreateClientDto,
    description: 'Client data',
  })
  @Post()
  async create(
    @Body() createClientDto: CreateClientDto,
  ): Promise<ClientResponseDto> {
    if (!createClientDto) {
      throw new BadRequestException('Invalid client data');
    }
    const data = await this.clientsService.create(createClientDto);

    if (!data) {
      throw new BadRequestException('Error creating client');
    }
    return data;
  }

  @ApiResponse({
    status: 200,
    description: 'Clients retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid pagination parameters',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit for pagination',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
  })
  @Get()
  async findAllClients(
    @Query() pagination: PaginationDto,
  ): Promise<ClientResponseDto[]> {
    const recados = await this.clientsService.findAllClients(pagination);
    if (recados.length <= 0) {
      throw new BadRequestException('No clients found');
    }
    return recados;
  }

  @ApiResponse({
    status: 200,
    description: 'Client retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid client ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  @ApiBody({
    type: String,
    description: 'Client ID',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClientResponseDto> {
    if (id == '' || id == null) {
      throw new BadRequestException('Invalid client ID');
    }
    const client = await this.clientsService.findOneClient(id);
    if (!client) {
      throw new BadRequestException('Client not found');
    }
    return client;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
  //   return this.clientsService.update(+id, updateClientDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (id == '' || id == null) {
      throw new BadRequestException('Invalid client ID');
    }
    return this.clientsService.remove(id);
  }
}
