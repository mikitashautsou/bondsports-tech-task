import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncServiceResponse } from 'src/shared/responses/async-service-response.type';
import { TransactionEntity } from 'src/transactions/transaction.entity';
import { Connection, Repository } from 'typeorm';
import { AccountEntity } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountsRepository: Repository<AccountEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private connection: Connection,
  ) {}

  async deposit(
    accountId: string,
    value: number,
  ): AsyncServiceResponse<void, TransactionEntity> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = await this.accountsRepository.findOne({ accountId });
      account.balance += value;
      this.accountsRepository.save(account);
      // TODO: reduce to one update operation
      const transaction = await this.transactionRepository.create({
        accountId,
        value,
      });
      const transactionEntity = await this.transactionRepository.save(
        transaction,
      );
      await queryRunner.commitTransaction();
      return {
        status: 'success',
        payload: transactionEntity,
      };
    } catch (e) {
      queryRunner.rollbackTransaction();
      console.error(e);
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(
    accountId: string,
    value: number,
  ): AsyncServiceResponse<'insufficient_funds', TransactionEntity> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = await this.accountsRepository.findOne({ accountId });
      if (account.balance < value) {
        return {
          status: 'insufficient_funds',
        };
      }
      account.balance -= value;
      this.accountsRepository.save(account);
      const transaction = await this.transactionRepository.create({
        accountId,
        value,
      });
      const transactionEntity = await this.transactionRepository.save(
        transaction,
      );
      await queryRunner.commitTransaction();
      return {
        status: 'success',
        payload: transactionEntity,
      };
    } catch (e) {
      queryRunner.rollbackTransaction();
      console.error(e);
    } finally {
      await queryRunner.release();
    }
  }

  async create(account: AccountEntity): Promise<AccountEntity> {
    return await this.accountsRepository.save(account);
  }

  async findPersonAccounts(
    personId: string,
    accountId: string,
  ): Promise<AccountEntity> {
    return await this.accountsRepository.findOne({
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
