import { AccountEntity } from 'src/accounts/account.entity';
import { MonetaryColumn } from 'src/shared/decorators/money-column.decorator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionDTO } from './dto/transaction.dto';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @Column({ nullable: true })
  accountId: string;

  @ManyToOne(() => AccountEntity, (account) => account.transactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;

  @MonetaryColumn()
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
      accountId: this.accountId,
      transactionDate: this.transactionDate,
      value: this.value,
      transactionId: this.transactionId,
    };
  }
}
