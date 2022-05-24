import { PersonEntity } from 'src/persons/person.entity';
import { TransactionEntity } from 'src/transactions/transaction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AccountDTO } from './dto/account.dto';

export enum AccountType {
  PERSONAL = 'personal',
  CORPORATE = 'corporate',
}

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  accountId: string;

  @ManyToOne(() => PersonEntity, (person) => person.accounts)
  person: PersonEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.account)
  transactions: TransactionEntity[];

  @Column('decimal', { precision: 5, scale: 2 })
  balance: number;

  @Column('decimal', { precision: 5, scale: 2 })
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
      balance: this.balance,
      creationDate: this.creationDate,
      dailyWithdrawLimit: this.dailyWithdrawLimit,
      accountType: this.accountType,
      isActive: this.isActive,
      personId: this.person.personId,
    };
  }
}
