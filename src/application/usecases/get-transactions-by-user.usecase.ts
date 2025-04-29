import { Injectable } from '@nestjs/common';
import { Log } from 'src/shared/log';
import { TransactionService } from '../../domain/transaction.service';
import { TransactionDTO } from '../../shared/dto/transaction.dto';

@Injectable()
export class GetTransactionsByUserUseCase {
  constructor(private transactionService: TransactionService) {}

  execute(userId: string): Promise<TransactionDTO[]> {
    Log.info(
      'GetTransactionsByUserUseCase',
      `Getting transactions for userId ${userId}`,
    );

    return this.transactionService.getTransactionsByUser(userId);
  }
}
