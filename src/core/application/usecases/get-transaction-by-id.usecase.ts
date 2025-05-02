import { Injectable } from '@nestjs/common';
import { ErrorCodesKeys } from '../../../common/errors/error-code-keys.enum';
import { NotFoundException } from '../../../common/errors/exceptions/not-found.exception';
import { Log } from '../../../common/log';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';
import { TransactionService } from '../../domain/services/transaction.service';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(private repository: TransactionRepositoryPort, private service: TransactionService) {}

  async execute(id: string): Promise<Transaction> {
    Log.info('GetTransactionByIdUseCase', `Getting transaction with id ${id}`);

    this.service.validateId(id);

    const transaction: Transaction | null = await this.repository.findById(id);

    if (!transaction) {
      Log.error('TransactionService', `Transaction with ID ${id} not found`);
      throw new NotFoundException(ErrorCodesKeys.TRANSACTION_NOT_FOUND);
    }

    Log.info(
      'TransactionService',
      `Transaction with ID ${transaction.id} retrieved successfully`,
    );

    return transaction;
  }
}

// TODO: Check if this is a requirement for the project
