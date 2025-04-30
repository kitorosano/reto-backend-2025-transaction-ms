import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Log } from '../../../common/log';
import { customValidationPipeExceptionFactory } from '../../../common/utils';
import { TransactionServicePort } from '../../../core/application/ports/inbounds/transaction.service.port';
import { BadRequestExceptionFilter } from '../filters/bad-request-exception.filter';
import { NotFoundExceptionFilter } from '../filters/not-found-exception.filter';
import { TransactionHTTPMapper } from '../mappers/transaction.http.mapper';
import { RegisterTransactionHTTPRequest } from '../models/register-transaction.http.request';
import { TransactionHTTPResponse } from '../models/transaction.http.response';

@Controller('transactions')
@UseFilters(BadRequestExceptionFilter, NotFoundExceptionFilter)
export class TransactionHTTPAdapter {
  constructor(private application: TransactionServicePort) {}

  @Post()
  @HttpCode(201)
  async registerTransaction(
    @Body() request: RegisterTransactionHTTPRequest,
  ): Promise<TransactionHTTPResponse> {
    const userId = '1'; // This should be replaced with actual user ID from request context or token

    Log.info(
      'TransactionHTTPAdapter',
      '(POST) Register New Transaction',
      request,
    );

    const dto = TransactionHTTPMapper.toDTO(request, userId);

    const transaction = await this.application.createTransaction(dto);

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

    const transactions = await this.application.getTransactionsByUser(userId);

    return transactions.map((transaction) =>
      TransactionHTTPMapper.toResponse(transaction),
    );
  }

  @Get(':id')
  @HttpCode(200)
  @UseFilters(NotFoundExceptionFilter)
  async getTransaction(
    @Param('id') id: string,
  ): Promise<TransactionHTTPResponse> {
    Log.info('TransactionHTTPAdapter', '(GET) Get Transaction by ID', id);

    const transaction = await this.application.getTransactionById(id);

    return TransactionHTTPMapper.toResponse(transaction);
  }
}
