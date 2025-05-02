import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from '../../../common/dto/create-transaction.dto';
import { TransactionDTO } from '../../../common/dto/transaction.dto';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { TransactionServicePort } from '../ports/inbounds/transaction.service.port';
import { CreateTransactionUseCase } from '../usecases/create-transaction.usecase';
import { GetTransactionByIdUseCase } from '../usecases/get-transaction-by-id.usecase';
import { GetUserTransactionHistoryUseCase } from '../usecases/get-user-transaction-history.usecase';

@Injectable()
export class TransactionService implements TransactionServicePort {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly getUserTransactionHistoryUseCase: GetUserTransactionHistoryUseCase,
  ) {}

  async createTransaction(dto: CreateTransactionDTO): Promise<TransactionDTO> {
    const transaction = await this.createTransactionUseCase.execute(dto);
    return TransactionMapper.toDTO(transaction);
  }

  async getTransactionById(id: string): Promise<TransactionDTO> {
    const transaction = await this.getTransactionByIdUseCase.execute(id);
    return TransactionMapper.toDTO(transaction);
  }

  async getTransactionsByUser(userId: string): Promise<TransactionDTO[]> {
    const transactions =
      await this.getUserTransactionHistoryUseCase.execute(userId);
    return transactions.map(TransactionMapper.toDTO);
  }
}
