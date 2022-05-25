import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './accounts/account.entity';
import { AccountsModule } from './accounts/accounts.module';
import { PersonEntity } from './persons/person.entity';
import { PersonsModule } from './persons/persons.module';
import { ServiceErrorFilter } from './shared/filters/service-error.filter';
import { TransactionEntity } from './transactions/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'test',
      database: 'bondsports',
      logging: true,
      entities: [PersonEntity, AccountEntity, TransactionEntity], // TODO: add auto discovery of entities
      synchronize: true,
    }),
    PersonsModule,
    AccountsModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ServiceErrorFilter,
    },
  ],
})
export class AppModule {}
