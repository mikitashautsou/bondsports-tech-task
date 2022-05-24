import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonEntity } from 'src/persons/person.entity';
import { AccountEntity } from './account.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, PersonEntity])],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
