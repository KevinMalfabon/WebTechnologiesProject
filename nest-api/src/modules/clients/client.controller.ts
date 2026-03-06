import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateClientDto, GetClientsDto, UpdateClientDto } from './client.dto';
import { ClientEntity } from './client.entity';
import { ClientService } from './client.service';

type PaginatedResponse<T> = {
  data: T[];
  totalCount: number;
};

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async getClients(
    @Query() input: GetClientsDto,
  ): Promise<PaginatedResponse<ClientEntity>> {
    const [property, rawDirection] = input.sort
      ? input.sort.split(',')
      : ['lastName', 'ASC'];
    const direction: 'ASC' | 'DESC' = rawDirection === 'DESC' ? 'DESC' : 'ASC';

    const [clients, totalCount] = await this.clientService.getAllClients(
      input.limit,
      input.offset,
      property,
      direction,
    );

    return { data: clients, totalCount };
  }

  @Get(':id')
  getClient(@Param('id') id: string): Promise<ClientEntity> {
    return this.clientService.getClientById(id);
  }

  @Post()
  createClient(@Body() dto: CreateClientDto): Promise<ClientEntity> {
    return this.clientService.createClient(dto);
  }

  @Patch(':id')
  updateClient(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<ClientEntity> {
    return this.clientService.updateClient(id, dto);
  }

  @Delete(':id')
  deleteClient(@Param('id') id: string): Promise<void> {
    return this.clientService.deleteClient(id);
  }
}
