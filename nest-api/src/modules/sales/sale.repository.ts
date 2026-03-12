import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../clients/client.entity';
import { BookEntity } from '../books/entities/book.entity';
import {
  CreateSaleModel,
  FilterSalesModel,
  SaleModel,
  UpdateSaleModel,
} from './sale.model';
import { SaleEntity, type SaleId } from './sale.entity';

@Injectable()
export class SaleRepository {
  constructor(
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) { }

  public async getAllSales(
    input?: FilterSalesModel,
  ): Promise<[SaleModel[], number]> {
    const where: any = {};
    if (input?.clientId) {
      where.clientId = input.clientId;
    }

    const [sales, totalCount] = await this.saleRepository.findAndCount({
      where,
      take: input?.limit,
      skip: input?.offset,
      relations: {
        client: true,
        book: true,
      },
      order: input?.sort,
    });

    return [sales as SaleModel[], totalCount];
  }

  public async getSaleById(id: string): Promise<SaleModel | undefined> {
    const sale = await this.saleRepository.findOne({
      where: { id: id as SaleId },
      relations: {
        client: true,
        book: true,
      },
    });

    if (!sale) {
      return undefined;
    }

    return sale as SaleModel;
  }

  public async createSale(sale: CreateSaleModel): Promise<SaleModel> {
    const client = await this.clientRepository.findOne({
      where: { id: sale.clientId },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    const book = await this.bookRepository.findOne({
      where: { id: sale.bookId as BookEntity['id'] }, // Ensure type compatibility
    });

    if (!book) {
      throw new Error('Book not found');
    }

    const createdSale = await this.saleRepository.save(
      this.saleRepository.create(sale),
    );

    const createdSaleWithRelations = await this.saleRepository.findOne({
      where: { id: createdSale.id },
      relations: {
        client: true,
        book: true,
      },
    });

    return createdSaleWithRelations as SaleModel;
  }

  public async updateSale(
    id: string,
    sale: UpdateSaleModel,
  ): Promise<SaleModel | undefined> {
    const oldSale = await this.saleRepository.findOne({
      where: { id: id as SaleId },
    });

    if (!oldSale) {
      return undefined;
    }

    if (sale.clientId) {
      const client = await this.clientRepository.findOne({
        where: { id: sale.clientId },
      });

      if (!client) {
        throw new Error('Client not found');
      }
    }

    if (sale.bookId) {
      const book = await this.bookRepository.findOne({
        where: { id: sale.bookId as BookEntity['id'] },
      });

      if (!book) {
        throw new Error('Book not found');
      }
    }

    await this.saleRepository.update(id, sale);

    return this.getSaleById(id);
  }

  public async deleteSale(id: string): Promise<void> {
    await this.saleRepository.delete(id);
  }
}
