import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountEntity } from './account.entity';
import { AccountsService } from './accounts.service';
import { AccountDTO } from './dto/account.dto';
import { CreateAccountDTO } from './dto/create-account.dto';
import { DepositRequestDTO } from './dto/deposit-request.dto';
import { QueryAccountsDTO } from './dto/query-accounts.dto';
import { UpdateAccountDTO } from './dto/update-account.dto';
import { WithdrawRequestDTO } from './dto/withdraw.request.dto';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post(':accountId/deposit')
  async deposit(
    @Param('accountId') accountId: string,
    @Body() depositRequest: DepositRequestDTO,
  ) {
    const transaction = await this.accountsService.deposit(
      accountId,
      depositRequest.value,
    );

    return {
      status: 'success',
      transaction: transaction.toDTO(),
    };
  }

  @Post(':accountId/withdraw')
  async withdraw(
    @Param('accountId') accountId: string,
    @Body() withdrawRequest: WithdrawRequestDTO,
  ) {
    const transaction = await this.accountsService.withdraw(
      accountId,
      withdrawRequest.value,
    );

    return {
      status: 'success',
      transaction: transaction?.toDTO(),
    };
  }

  @Get(':accountId/balance')
  @ApiResponse({
    type: AccountDTO,
  })
  async getAccountBalance(@Param('accountId') accountId: string) {
    const accountEntity = await this.accountsService.findById(accountId);
    return {
      balance: accountEntity.balance,
    };
  }

  @Get(':accountId/transactions')
  @ApiResponse({
    type: AccountDTO,
  })
  async getAccountTransactions(
    @Param('accountId') accountId: string,
    @Query() { fromDate, toDate }: QueryAccountsDTO,
  ) {
    const transactions = await this.accountsService.getAccountTransactions(
      accountId,
      { fromDate, toDate },
    );
    return {
      transactions: transactions.map((t) => t.toDTO()),
    };
  }

  @Put(':accountId/activate')
  @ApiResponse({
    type: AccountDTO,
  })
  async activateAccount(@Param('accountId') accountId: string) {
    await this.accountsService.activateAccount(accountId);
    return {
      status: 'success',
    };
  }

  @Put(':accountId/deactivate')
  @ApiResponse({
    type: AccountDTO,
  })
  async deactivateAccount(@Param('accountId') accountId: string) {
    await this.accountsService.deactivateAccount(accountId);
    return {
      status: 'success',
    };
  }

  @Post()
  async create(@Body() createAccountDTO: CreateAccountDTO) {
    return await this.accountsService.create(
      new AccountEntity(createAccountDTO),
    );
  }

  @Get(':accountId')
  @ApiResponse({
    type: AccountDTO,
  })
  async findById(@Param('accountId') accountId: string) {
    const accountEntity = await this.accountsService.findById(accountId);
    if (!accountEntity) {
      return {
        status: 'account_not_found',
      };
    }
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
    @Body() updateAccountDTO: UpdateAccountDTO,
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
