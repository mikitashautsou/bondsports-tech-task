import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class WithdrawRequestDTO {
  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  value: number;

  constructor(initialData: Partial<WithdrawRequestDTO>) {
    Object.assign(this, initialData);
  }
}
