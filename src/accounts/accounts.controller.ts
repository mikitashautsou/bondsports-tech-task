import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountEntity } from './account.entity';
import { AccountsService } from './accounts.service';
import { AccountDTO } from './dto/account.dto';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  async create(@Body() createAccountDTO: AccountDTO) {
    return await this.accountsService.create(
      new AccountEntity(createAccountDTO),
    );
  }

  @Get(':accountIdd')
  @ApiResponse({
    type: AccountDTO,
  })
  async findById(@Param('accountId') accountId: string) {
    const accountEntity = await this.accountsService.findById(accountId);
    return accountEntity.toDTO();
  }

  @Get()
  @ApiResponse({
    type: [AccountDTO],
  })
  async findAll(): Promise<AccountDTO[]> {
    const accounts = await this.accountsService.findAll();
    return accounts.map((p) => p.toDTO());
  }

  @Patch(':accountId')
  async update(
    @Param('accountId') accountId: string,
    @Body() updateAccountDTO: AccountDTO,
  ) {
    return await this.accountsService.update(
      accountId,
      new AccountEntity(updateAccountDTO),
    );
  }

  @Delete(':accountId')
  async delete(@Param('accountId') accountId: string) {
    return await this.accountsService.remove(accountId);
  }
}
