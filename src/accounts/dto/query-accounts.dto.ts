import { IsNumber, IsOptional } from 'class-validator';

export class QueryAccountsDTO {
  @IsOptional()
  @IsNumber()
  fromDate: number;

  @IsOptional()
  @IsNumber()
  toDate: number;
}
