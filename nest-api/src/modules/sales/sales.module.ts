import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SaleEntity } from './sales.entity';
import { BookModule } from '../books/book.module';

@Module({
  imports: [
    // This makes the SaleEntity repository available for injection
    TypeOrmModule.forFeature([SaleEntity]),
    BookModule, // Useful if the SalesService needs to call BookService methods
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
