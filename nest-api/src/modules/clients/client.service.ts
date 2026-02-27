import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto, UpdateClientDto } from './client.dto';
import { ClientEntity } from './client.entity';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  getAllClients(
    limit: number,
    offset: number,
    sortProperty: string,
    sortDirection: 'ASC' | 'DESC',
  ): Promise<[ClientEntity[], number]> {
    return this.clientRepository.findAndCount({
      limit,
      offset,
      order: { [sortProperty]: sortDirection } as any, // abajo te digo cómo quitar el any si quieres
    });
  }

  async getClientById(id: string): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  createClient(dto: CreateClientDto): Promise<ClientEntity> {
    return this.clientRepository.createAndSave({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email ?? null,
      picture: dto.picture ?? null,
    });
  }

  async updateClient(id: string, dto: UpdateClientDto): Promise<ClientEntity> {
    const updated = await this.clientRepository.updateById(id, {
      ...dto,
      email: dto.email ?? undefined,
      picture: dto.picture ?? undefined,
    });
    if (!updated) throw new NotFoundException('Client not found');
    return updated;
  }

  async deleteClient(id: string): Promise<void> {
    await this.getClientById(id);
    await this.clientRepository.deleteById(id);
  }
}