import { AccountEntity } from 'src/accounts/account.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TransactionDTO } from './dto/transaction.dto';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @ManyToOne(() => AccountEntity, (account) => account.transactions)
  account: AccountEntity;

  @Column('decimal', { precision: 5, scale: 2 })
  value: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  transactionDate: Date;

  constructor(initialData: Partial<AccountEntity>) {
    Object.assign(this, initialData);
  }

  toDTO(): TransactionDTO {
    return {
      accountId: this.account.accountId,
      transactionDate: this.transactionDate,
      value: this.value,
    };
  }
}
