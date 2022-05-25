import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsRepository } from 'src/transactions/transaction.repository';
import { AccountEntity } from './account.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, TransactionsRepository])],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
