import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { AccountType } from '../account.entity';

export class AccountDTO {
  @ApiProperty()
  @IsOptional()
  accountId: string;

  @ApiProperty()
  @IsNotEmpty()
  personId: string;

  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  balance: number;

  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  dailyWithdrawLimit: number;

  @ApiProperty({ enum: AccountType })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty()
  @IsOptional()
  isActive: boolean;

  @ApiProperty()
  @IsDateString(AccountType)
  @IsOptional()
  creationDate: Date;

  constructor(initialData: Partial<AccountDTO>) {
    Object.assign(this, initialData);
  }
}
