import { Injectable } from '@nestjs/common';
import { Log } from '../../../common/log';
import { TransactionFactory } from '../../domain/factories/transaction.factory';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';
import { ResourceNotFoundException } from '../../../common/exceptions/application.exceptions';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(
    private repository: TransactionRepositoryPort,
    private factory: TransactionFactory,
  ) {}

  async execute(id: string): Promise<Transaction> {
    Log.info('GetTransactionByIdUseCase', `Getting transaction with id ${id}`);

    const transaction: Transaction | null = await this.repository.findById(id);

    if (!transaction) {
      Log.error('TransactionService', `Transaction not found with id: ${id}`);
      throw new ResourceNotFoundException('Transaction not found', id);
    }

    Log.info(
      'TransactionService',
      `Transaction with ID ${transaction.id} retrieved successfully`,
    );

    return transaction;
  }
}

// TODO: Check if this is a requirement for the project
