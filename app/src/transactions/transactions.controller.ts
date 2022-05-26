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
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { TransactionDTO } from './dto/transaction.dto';
import { UpdateTransactionDTO } from './dto/update-transaction.dto';
import { TransactionEntity } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() createTransactionDTO: CreateTransactionDTO) {
    return await this.transactionsService.create(
      new TransactionEntity(createTransactionDTO),
    );
  }

  @Get(':transactionId')
  @ApiResponse({
    type: TransactionDTO,
  })
  async findById(@Param('transactionId') transactionId: string) {
    const transactionEntity = await this.transactionsService.findById(
      transactionId,
    );
    if (!transactionEntity) {
      return {
        status: 'transaction_not_found',
      };
    }
    return transactionEntity.toDTO();
  }

  @Get()
  @ApiResponse({
    type: [TransactionDTO],
  })
  async findAll(): Promise<TransactionDTO[]> {
    const transactions = await this.transactionsService.findAll();
    return transactions.map((p) => p.toDTO());
  }

  @Patch(':transactionId')
  async update(
    @Param('transactionId') transactionId: string,
    @Body() updateTransactionDTO: UpdateTransactionDTO,
  ) {
    return await this.transactionsService.update(
      transactionId,
      new TransactionEntity(updateTransactionDTO),
    );
  }

  @Delete(':transactionId')
  async delete(@Param('transactionId') transactionId: string) {
    return await this.transactionsService.remove(transactionId);
  }
}
