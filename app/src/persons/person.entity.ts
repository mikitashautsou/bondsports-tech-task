import { AccountEntity } from 'src/accounts/account.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PersonDTO } from './dto/person.dto';

@Entity()
export class PersonEntity {
  @PrimaryGeneratedColumn('uuid')
  personId: string;

  @Column()
  name: string;

  @Column()
  document: string;

  @Column()
  birthDate: Date;

  @OneToMany(() => AccountEntity, (account) => account.person)
  accounts: AccountEntity[];

  constructor(initialData: Partial<PersonEntity>) {
    Object.assign(this, initialData);
  }

  toDTO(): PersonDTO {
    return {
      personId: this.personId,
      birthDate: this.birthDate,
      document: this.document,
      name: this.name,
    };
  }
}
