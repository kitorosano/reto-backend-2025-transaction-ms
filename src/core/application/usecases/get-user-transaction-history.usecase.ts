import { Injectable } from '@nestjs/common';
import { Log } from 'src/common/log';
import { TransactionFactory } from '../../domain/factories/transaction.factory';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';

@Injectable()
export class GetUserTransactionHistoryUseCase {
  constructor(
    private repository: TransactionRepositoryPort,
    private factory: TransactionFactory,
  ) {}

  async execute(userId: string): Promise<Transaction[]> {
    Log.info(
      'GetTransactionsByUserUseCase',
      `Getting transaction history for userId ${userId}`,
    );

    const transactionHistory = await this.repository.findByUser(userId);

    Log.info(
      'TransactionService',
      `Transactions for USERID ${userId} retrieved successfully`,
    );

    return transactionHistory;
  }
}