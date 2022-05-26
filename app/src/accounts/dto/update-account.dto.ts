import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { AccountType } from '../account.entity';

export class UpdateAccountDTO {
  @ApiProperty()
  @IsOptional()
  personId: string;

  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  balance: number;

  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  dailyWithdrawLimit: number;

  @ApiProperty({ enum: AccountType })
  @IsEnum(AccountType)
  @IsOptional()
  accountType: AccountType;

  @ApiProperty()
  @IsOptional()
  isActive: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  creationDate: Date;

  constructor(initialData: Partial<UpdateAccountDTO>) {
    Object.assign(this, initialData);
  }
}
