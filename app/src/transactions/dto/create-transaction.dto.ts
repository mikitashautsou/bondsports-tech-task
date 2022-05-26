import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDTO {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @IsDate()
  @IsNotEmpty()
  transactionDate: Date;

  constructor(initialData: Partial<CreateTransactionDTO>) {
    Object.assign(this, initialData);
  }
}
