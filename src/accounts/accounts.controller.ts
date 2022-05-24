import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AccountEntity } from './account.entity';
import { AccountsService } from './accounts.service';
import { AccountDTO } from './dto/account.dto';
import { DepositRequestDTO } from './dto/deposit-request.dto';
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
    const { status, payload } = await this.accountsService.deposit(
      accountId,
      depositRequest.value,
    );
    if (status === 'error') {
      return {
        status: 'error',
        message: 'An error occurred while depositing funds',
      };
    }
    if (status === 'success') {
      return {
        status: 'success',
        message: 'Funds successfully deposited',
        transaction: payload.toDTO(),
      };
    }
  }

  @Post(':accountId/withdraw')
  async withdraw(
    @Param('accountId') accountId: string,
    @Body() withdrawRequest: WithdrawRequestDTO,
    @Res() response: Response,
  ) {
    const { status, payload } = await this.accountsService.withdraw(
      accountId,
      withdrawRequest.value,
    );
    if (status === 'error') {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        JSON.stringify({
          status: 'error',
          message: 'An error occurred while withdrawing funds',
        }),
      );
    } else if (status === 'insufficient_funds') {
      response.status(HttpStatus.BAD_REQUEST).send(
        JSON.stringify({
          status: 'error',
          message: 'Insufficient funds to withdraw from the account',
        }),
      );
    } else if (status === 'success') {
      response.status(HttpStatus.OK).send({
        status: 'success',
        message: 'Funds successfully withdrawn',
        transaction: payload.toDTO(),
      });
    }
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

  @Post()
  async create(@Body() createAccountDTO: AccountDTO) {
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
