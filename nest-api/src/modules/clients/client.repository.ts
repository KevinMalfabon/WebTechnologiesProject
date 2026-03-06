import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { ClientEntity } from './client.entity';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repo: Repository<ClientEntity>,
  ) {}

  findAndCount(options: {
    limit: number;
    offset: number;
    order: FindOptionsOrder<ClientEntity>;
  }): Promise<[ClientEntity[], number]> {
    return this.repo.findAndCount({
      take: options.limit,
      skip: options.offset,
      order: options.order,
    });
  }

  findById(id: string): Promise<ClientEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  createAndSave(data: Omit<ClientEntity, 'id'>): Promise<ClientEntity> {
    const entity: ClientEntity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async updateById(
    id: string,
    patch: Partial<ClientEntity>,
  ): Promise<ClientEntity | null> {
    await this.repo.update({ id }, patch);
    return this.findById(id);
  }

  deleteById(id: string): Promise<void> {
    return this.repo.delete({ id }).then(() => undefined);
  }
}
