import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../../../application/usecases/create-transaction.usecase';
import { GetTransactionByIdUseCase } from '../../../application/usecases/get-transaction-by-id.usecase';
import { GetTransactionsByUserUseCase } from '../../../application/usecases/get-transactions-by-user.usecase';
import { Log } from '../../../shared/log';
import { BadRequestCustomExceptionFilter } from '../exceptions/bad-request-exception.filter';
import { NotFoundCustomExceptionFilter } from '../exceptions/not-found-exception.filter';
import { TransactionHTTPMapper } from '../mappers/transaction.http.mapper';
import { RegisterTransactionHTTPRequest } from '../models/register-transaction.http.request';
import { TransactionHTTPResponse } from '../models/transaction.http.response';

@Controller('transactions')
export class TransactionHTTPAdapter {
  constructor(
    private createTransactionUseCase: CreateTransactionUseCase,
    private getTransactionsByUserUseCase: GetTransactionsByUserUseCase,
    private getTransactionByIdUseCase: GetTransactionByIdUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UseFilters(BadRequestCustomExceptionFilter)
  async registerTransaction(
    @Body() request: RegisterTransactionHTTPRequest,
  ): Promise<TransactionHTTPResponse> {
    Log.info(
      'TransactionHTTPAdapter',
      '(POST) Register New Transaction',
      request,
    );

    const dto = TransactionHTTPMapper.toDTO(request);

    const transaction = await this.createTransactionUseCase.execute(dto);

    return TransactionHTTPMapper.toResponse(transaction);
  }

  @Get()
  @HttpCode(200)
  async getUserTransactions(): Promise<TransactionHTTPResponse[]> {
    const userId = '1'; // This should be replaced with actual user ID from request context or token
    Log.info(
      'TransactionHTTPAdapter',
      `(GET) Get Transactions by USERID`,
      userId,
    );

    const transactions =
      await this.getTransactionsByUserUseCase.execute(userId);

    return transactions.map((transaction) =>
      TransactionHTTPMapper.toResponse(transaction),
    );
  }

  @Get(':id')
  @HttpCode(200)
  @UseFilters(NotFoundCustomExceptionFilter)
  async getTransaction(
    @Param('id') id: string,
  ): Promise<TransactionHTTPResponse> {
    Log.info('TransactionHTTPAdapter', '(GET) Get Transaction by ID', id);

    const transaction = await this.getTransactionByIdUseCase.execute(id);

    return TransactionHTTPMapper.toResponse(transaction);
  }
}
