import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateIf((e) => e.picture !== '')
  @IsOptional()
  @IsUrl()
  picture?: string;
}

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateIf((e) => e.picture !== '')
  @IsOptional()
  @IsUrl()
  picture?: string;
}

export class GetClientsDto {
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;

  @IsInt()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsString()
  sort?: string; // ex: "lastName,ASC"
}
