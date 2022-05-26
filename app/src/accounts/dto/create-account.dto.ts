import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { AccountType } from '../account.entity';

export class CreateAccountDTO {
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
  @IsOptional()
  dailyWithdrawLimit: number;

  @ApiProperty({ enum: AccountType })
  @IsEnum(AccountType)
  @IsNotEmpty()
  accountType: AccountType;

  @ApiProperty()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  creationDate: Date;

  constructor(initialData: Partial<CreateAccountDTO>) {
    Object.assign(this, initialData);
  }
}
