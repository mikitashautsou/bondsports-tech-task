import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/accounts/account.entity';
import { PersonEntity } from './person.entity';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity, AccountEntity])],
  providers: [PersonsService],
  controllers: [PersonsController],
})
export class PersonsModule {}
