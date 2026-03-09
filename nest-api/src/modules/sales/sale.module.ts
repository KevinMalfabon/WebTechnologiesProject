import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from '../books/entities/book.entity';
import { ClientEntity } from '../clients/client.entity';
import { SaleController } from './sale.controller';
import { SaleEntity } from './sale.entity';
import { SaleRepository } from './sale.repository';
import { SaleService } from './sale.service';

@Module({
  imports: [TypeOrmModule.forFeature([SaleEntity, ClientEntity, BookEntity])],
  controllers: [SaleController],
  providers: [SaleRepository, SaleService],
})
export class SaleModule {}
