import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class TransactionDTO {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @IsDateString()
  @IsOptional()
  transactionDate: Date;

  constructor(initialData: Partial<TransactionDTO>) {
    Object.assign(this, initialData);
  }
}
