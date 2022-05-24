import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountsRepository: Repository<AccountEntity>,
  ) {}

  async create(account: AccountEntity): Promise<AccountEntity> {
    return await this.accountsRepository.save(account);
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
