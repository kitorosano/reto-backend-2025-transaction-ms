import { Injectable } from '@nestjs/common';
import { Log } from 'src/shared/utils/log';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionService } from '../../domain/services/transaction.service';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';

@Injectable()
export class GetUserTransactionHistoryUseCase {
  constructor(
    private repository: TransactionRepositoryPort,
    private service: TransactionService,
  ) {}

  async execute(userId: string): Promise<Transaction[]> {
    Log.info(
      'GetTransactionsByUserUseCase',
      `Getting transaction history for userId ${userId}`,
    );

    this.service.validateUserId(userId);

    const transactionHistory = await this.repository.findByUser(userId);

    Log.info(
      'GenerateMonthlyReportUseCase',
      `Transactions (${transactionHistory.length}) retrieved successfully, for USERID ${userId}`,
    );

    return transactionHistory;
  }
}
