import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  info: string;

  @IsInt()
  bookCount: number;
}
