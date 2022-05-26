import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class UpdateTransactionDTO {
  @ApiProperty()
  @IsOptional()
  accountId: string;

  @ApiProperty()
  @IsOptional()
  value: number;

  @IsDate()
  @IsOptional()
  transactionDate: Date;

  constructor(initialData: Partial<UpdateTransactionDTO>) {
    Object.assign(this, initialData);
  }
}
