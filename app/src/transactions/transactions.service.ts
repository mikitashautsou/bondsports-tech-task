import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionsRepository: Repository<TransactionEntity>,
  ) {}

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
    await this.transactionsRepository.update(
      { transactionId: id },
      transaction,
    );
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.delete(id);
  }
}
