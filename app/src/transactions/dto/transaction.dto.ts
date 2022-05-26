import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionDTO {
  @ApiProperty()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @IsDate()
  @IsNotEmpty()
  transactionDate: Date;

  constructor(initialData: Partial<TransactionDTO>) {
    Object.assign(this, initialData);
  }
}
