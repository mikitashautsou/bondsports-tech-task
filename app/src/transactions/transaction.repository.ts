import { EntityRepository, Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@EntityRepository(TransactionEntity)
export class TransactionsRepository extends Repository<TransactionEntity> {
  async calcWithdrawnAmount(accountId: string, startDate: Date, endDate: Date) {
    const { sum } = await this.createQueryBuilder('transactions')
      .where(
        `transactions.transactionDate BETWEEN :startDate AND :endDate AND transactions.value < 0 AND transactions.accountId =:accountId`,
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          accountId,
        },
      )
      .select('SUM(transactions.value)', 'sum')
      .getRawOne();
    return -sum;
  }
}
