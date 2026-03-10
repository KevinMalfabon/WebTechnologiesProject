import { Injectable } from '@nestjs/common';
import {
  CreateSaleModel,
  FilterSalesModel,
  SaleModel,
  UpdateSaleModel,
} from './sale.model';
import { SaleRepository } from './sale.repository';

@Injectable()
export class SaleService {
  constructor(private readonly saleRepository: SaleRepository) {}

  public async getAllSales(
    input?: FilterSalesModel,
  ): Promise<[SaleModel[], number]> {
    return this.saleRepository.getAllSales(input);
  }

  public async getSaleById(id: string): Promise<SaleModel | undefined> {
    return this.saleRepository.getSaleById(id);
  }

  public async createSale(sale: CreateSaleModel): Promise<SaleModel> {
    return this.saleRepository.createSale(sale);
  }

  public async updateSale(
    id: string,
    sale: UpdateSaleModel,
  ): Promise<SaleModel | undefined> {
    const oldSale = await this.getSaleById(id);

    if (!oldSale) {
      return undefined;
    }

    return this.saleRepository.updateSale(id, sale);
  }

  public async deleteSale(id: string): Promise<void> {
    await this.saleRepository.deleteSale(id);
  }
}
