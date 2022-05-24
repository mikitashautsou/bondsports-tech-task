import { PersonEntity } from 'src/persons/person.entity';
import { MonetaryColumn } from 'src/shared/decorators/money-column.decorator';
import { TransactionEntity } from 'src/transactions/transaction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { AccountDTO } from './dto/account.dto';

export enum AccountType {
  PERSONAL = 'PERSONAL',
  CORPORATE = 'CORPORATE',
}

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  accountId: string;

  @Column({ nullable: true })
  personId: string;

  @ManyToOne(() => PersonEntity)
  @JoinColumn({ name: 'personId' })
  person: PersonEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.account)
  transactions: TransactionEntity[];

  @MonetaryColumn()
  balance: number;

  @MonetaryColumn()
  dailyWithdrawLimit: number;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.PERSONAL,
  })
  accountType: AccountType;

  @Column({
    default: () => 'CURRENT_DATE',
  })
  creationDate: Date;

  constructor(initialData: Partial<AccountEntity>) {
    Object.assign(this, initialData);
  }

  toDTO(): AccountDTO {
    return {
      accountId: this.accountId,
      balance: this.balance,
      creationDate: this.creationDate,
      dailyWithdrawLimit: this.dailyWithdrawLimit,
      accountType: this.accountType,
      isActive: this.isActive,
      personId: this.personId,
    };
  }
}
