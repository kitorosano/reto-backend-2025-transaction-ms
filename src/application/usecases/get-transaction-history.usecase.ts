import { Injectable } from '@nestjs/common';
import { Log } from 'src/shared/log';
import { TransactionService } from '../../domain/transaction.service';
import { TransactionDTO } from '../../shared/dto/transaction.dto';

@Injectable()
export class GetTransactionHistoryUseCase {
  constructor(private transactionService: TransactionService) {}

  async execute(userId: string): Promise<TransactionDTO[]> {
    Log.info(
      'GetTransactionsByUserUseCase',
      `Getting transaction history for userId ${userId}`,
    );

    const transactionHistory =
      await this.transactionService.getTransactionsByUser(userId);

    return transactionHistory;
  }
}

// TODO: Rename this to GetUserTransactionHistoryUseCase
