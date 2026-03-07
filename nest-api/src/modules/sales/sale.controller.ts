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
import { CreateSaleDto, GetSalesDto, UpdateSaleDto } from './sale.dto';
import { GetSalesModel } from './sale.model';
import { SaleService } from './sale.service';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  async getSales(@Query() input: GetSalesDto): Promise<GetSalesModel> {
    const [property, direction] = input.sort
      ? input.sort.split(',')
      : ['purchasedAt', 'DESC'];

    const [sales, totalCount] = await this.saleService.getAllSales({
      ...input,
      sort: {
        [property]: direction as 'ASC' | 'DESC',
      },
    });

    return {
      data: sales,
      totalCount,
    };
  }

  @Get(':id')
  public async getSale(@Param('id') id: string) {
    return this.saleService.getSaleById(id);
  }

  @Post()
  createSale(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.createSale(createSaleDto);
  }

  @Patch(':id')
  updateSale(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.saleService.updateSale(id, updateSaleDto);
  }

  @Delete(':id')
  deleteSale(@Param('id') id: string) {
    return this.saleService.deleteSale(id);
  }
}
