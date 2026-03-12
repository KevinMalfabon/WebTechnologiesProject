import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository, DeepPartial } from 'typeorm';
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
    const qb = this.repo.createQueryBuilder('client');
    qb.take(options.limit);
    qb.skip(options.offset);

    if (options.order) {
      for (const [key, value] of Object.entries(options.order)) {
        qb.addOrderBy(`client.${key}`, value as 'ASC' | 'DESC');
      }
    }

    qb.loadRelationCountAndMap('client.purchasedBooksCount', 'client.sales');

    return qb.getManyAndCount();
  }

  findById(id: string): Promise<ClientEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  createAndSave(data: DeepPartial<ClientEntity>): Promise<ClientEntity> {
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
