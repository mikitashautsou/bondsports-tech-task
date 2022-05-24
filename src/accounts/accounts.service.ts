import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceError } from 'src/shared/errors/service.error';
import { startTransaction } from 'src/shared/helpers/start-transaction.helper';
import { TransactionEntity } from 'src/transactions/transaction.entity';
import {
  Between,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  FindOperator,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountsRepository: Repository<AccountEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  async getAccountTransactions(
    accountId: string,
    filters?: { fromDate?: number; toDate?: number },
  ): Promise<TransactionEntity[]> {
    const whereClause: {
      accountId: string;
      transactionDate?: FindOperator<Date>;
    } = {
      accountId,
    };

    if (filters) {
      if (filters.fromDate && filters.toDate) {
        whereClause.transactionDate = Between(
          new Date(filters?.fromDate),
          new Date(filters.toDate),
        );
      } else if (filters.fromDate) {
        whereClause.transactionDate = MoreThanOrEqual(
          new Date(filters?.fromDate),
        );
      } else if (filters.toDate) {
        whereClause.transactionDate = LessThanOrEqual(
          new Date(filters?.toDate),
        );
      }
    }
    return await this.transactionRepository.find({
      where: whereClause,
      order: {
        transactionDate: 'DESC',
      },
    });
  }

  async deposit(accountId: string, value: number): Promise<TransactionEntity> {
    return await startTransaction(async () => {
      const account = await this.accountsRepository.findOne({ accountId });
      if (!account.isActive) {
        throw new ServiceError('account_is_deactivated');
      }
      account.balance += value;
      await this.accountsRepository.save(account);
      const transaction = await this.transactionRepository.create({
        accountId,
        value,
      });
      const transactionEntity = await this.transactionRepository.save(
        transaction,
      );
      return transactionEntity;
    });
  }

  async withdraw(accountId: string, value: number): Promise<TransactionEntity> {
    return await startTransaction(async () => {
      const account = await this.accountsRepository.findOne({ accountId });

      if (!account.isActive) {
        throw new ServiceError('account_is_deactivated');
      }
      if (account.balance < value) {
        throw new ServiceError('insufficient_funds');
      }
      account.balance -= value;
      await this.accountsRepository.update(accountId, account);
      const transaction = await this.transactionRepository.create({
        accountId,
        value,
      });
      const transactionEntity = await this.transactionRepository.save(
        transaction,
      );
      return transactionEntity;
    });
  }

  async activateAccount(accountId: string): Promise<void> {
    const account = await this.accountsRepository.findOne({ accountId });
    if (account.isActive) {
      throw new ServiceError('already_activated');
    }
    account.isActive = true;
    this.accountsRepository.update(accountId, account);
  }

  async deactivateAccount(accountId: string): Promise<void> {
    const account = await this.accountsRepository.findOne({ accountId });
    if (!account.isActive) {
      throw new ServiceError('already_deactivated');
    }
    account.isActive = false;
    this.accountsRepository.update(accountId, account);
  }

  async create(account: AccountEntity): Promise<AccountEntity> {
    return await this.accountsRepository.save(account);
  }

  async findPersonAccounts(
    personId: string,
    accountId: string,
  ): Promise<AccountEntity[]> {
    return await this.accountsRepository.find({
      where: {
        person: {
          personId,
        },
        accountId,
      },
    });
  }

  async findById(id: string): Promise<AccountEntity> {
    return await this.accountsRepository.findOne({
      where: { accountId: id },
    });
  }

  async findAll(): Promise<AccountEntity[]> {
    return await this.accountsRepository.find();
  }

  async update(id: string, account: AccountEntity): Promise<void> {
    await this.accountsRepository.update({ accountId: id }, account);
  }

  async remove(id: string): Promise<void> {
    await this.accountsRepository.delete(id);
  }
}
