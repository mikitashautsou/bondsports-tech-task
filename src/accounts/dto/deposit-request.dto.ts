import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class DepositRequestDTO {
  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  value: number;

  constructor(initialData: Partial<DepositRequestDTO>) {
    Object.assign(this, initialData);
  }
}
