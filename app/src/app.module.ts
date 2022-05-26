import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './accounts/account.entity';
import { AccountsModule } from './accounts/accounts.module';
import { ENV } from './config/env';
import { PersonEntity } from './persons/person.entity';
import { PersonsModule } from './persons/persons.module';
import { ServiceErrorFilter } from './shared/filters/service-error.filter';
import { TransactionEntity } from './transactions/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      username: ENV.DB_USERNAME,
      password: ENV.DB_PASSWORD,
      database: ENV.DB_DATABASE,
      logging: true,
      entities: [PersonEntity, AccountEntity, TransactionEntity], // TODO: add auto discovery of entities
      synchronize: true, // TODO: Only for demonstration purposes, use migrations instead
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
