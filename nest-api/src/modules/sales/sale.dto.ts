import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import type { BookId } from '../books/entities/book.entity';

export class CreateSaleDto {
  @IsUUID(4)
  clientId: string;

  @IsUUID(4)
  bookId: BookId;

  @IsDateString()
  purchasedAt: string;
}

export class UpdateSaleDto {
  @IsUUID(4)
  @IsOptional()
  clientId?: string;

  @IsUUID(4)
  @IsOptional()
  bookId?: BookId;

  @IsDateString()
  @IsOptional()
  purchasedAt?: string;
}

export class GetSalesDto {
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;

  @IsInt()
  @Min(0)
  offset: number;

  @IsString()
  @IsOptional()
  sort?: string;
}
