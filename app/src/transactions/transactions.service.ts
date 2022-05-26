import { Injectable } from '@nestjs/common';
import { TransactionEntity } from './transaction.entity';
import { TransactionsRepository } from './transaction.repository';

@Injectable()
export class TransactionsService {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async calcWithdrawnAmount(accountId: string, startDate: Date, endDate: Date) {
    return await this.transactionsRepository.calcWithdrawnAmount(
      accountId,
      startDate,
      endDate,
    );
  }

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    return await this.transactionsRepository.save(transaction);
  }

  async findById(id: string): Promise<TransactionEntity> {
    return await this.transactionsRepository.findOne({
      where: { transactionId: id },
    });
  }

  async findAll(): Promise<TransactionEntity[]> {
    return await this.transactionsRepository.find();
  }

  async update(id: string, transaction: TransactionEntity): Promise<void> {
    await this.transactionsRepository.update(id, transaction);
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.delete(id);
  }
}
