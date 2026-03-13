import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateSaleDto {
  @IsUUID(4)
  clientId: string;

  @IsUUID(4)
  bookId: string;

  @IsDateString()
  purchasedAt: string;
}

export class UpdateSaleDto {
  @IsUUID(4)
  @IsOptional()
  clientId?: string;

  @IsUUID(4)
  @IsOptional()
  bookId?: string;

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

  @IsUUID(4)
  @IsOptional()
  clientId?: string;
}
