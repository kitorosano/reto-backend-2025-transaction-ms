import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Log } from '../../../common/log';
import { TransactionServicePort } from '../../../core/application/ports/inbounds/transaction.service.port';
import { UserId } from '../common/decorators/user-id.decorator';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestValidationPipe } from '../common/pipes/requests-validation.pipe';
import { TransactionHTTPMapper } from '../mappers/transaction.http.mapper';
import { RegisterTransactionHTTPRequest } from '../models/register-transaction.http.request';
import { TransactionHTTPResponse } from '../models/transaction.http.response';

@Controller('transactions')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(RequestValidationPipe)
@UseGuards(AuthGuard)
export class TransactionHTTPAdapter {
  constructor(private application: TransactionServicePort) {}

  @Post()
  @HttpCode(201)
  async registerTransaction(
    @Body() request: RegisterTransactionHTTPRequest,
    @UserId() userId: string,
  ): Promise<TransactionHTTPResponse> {
    Log.info(
      'TransactionHTTPAdapter',
      `(POST) Register New Transaction by USERID ${userId}`,
      request,
    );

    const dto = TransactionHTTPMapper.toDTO(request, userId);

    const transaction = await this.application.createTransaction(dto);

    return TransactionHTTPMapper.toResponse(transaction);
  }

  @Get()
  @HttpCode(200)
  async getUserTransactions(
    @UserId() userId: string,
  ): Promise<TransactionHTTPResponse[]> {
    Log.info(
      'TransactionHTTPAdapter',
      `(GET) Get Transactions by USERID ${userId}`,
    );

    const transactions = await this.application.getTransactionsByUser(userId);

    return transactions.map((transaction) =>
      TransactionHTTPMapper.toResponse(transaction),
    );
  }

  @Get(':id')
  @HttpCode(200)
  async getTransaction(
    @Param('id') id: string,
  ): Promise<TransactionHTTPResponse> {
    Log.info('TransactionHTTPAdapter', `(GET) Get Transaction by ID ${id}`);

    const transaction = await this.application.getTransactionById(id);

    return TransactionHTTPMapper.toResponse(transaction);
  }
}
