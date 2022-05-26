import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { AccountType } from '../account.entity';

export class AccountDTO {
  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty()
  dailyWithdrawLimit: number;

  @ApiProperty({ enum: AccountType })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  creationDate: Date;

  constructor(initialData: Partial<AccountDTO>) {
    Object.assign(this, initialData);
  }
}
