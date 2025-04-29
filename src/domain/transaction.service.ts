import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from '../shared/dto/create-transaction.dto';
import { Log } from '../shared/log';
import { BadRequestCustomException } from './exceptions/bad-request.exception';
import { NotFoundCustomException } from './exceptions/not-found.exception';
import { Transaction } from './models/transaction.model';
import { TransactionRepositoryPort } from './ports/transaction.repository.port';

@Injectable()
export class TransactionService {
  constructor(private repository: TransactionRepositoryPort) {}

  async createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
    const transaction = new Transaction().create(dto);

    if (!transaction.isValid()) {
      Log.error(
        'TransactionService',
        `Transaction data is not valid`,
        transaction.errors,
      );
      throw new BadRequestCustomException(
        'Invalid transaction data',
        transaction.errors,
      );
    }

    const newTransaction = await this.repository.save(transaction);
    Log.info(
      'TransactionService',
      `Transaction created successfully with ID ${newTransaction.id}`,
    );
    return newTransaction;
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.repository.findById(id);

    if (!transaction) {
      Log.error('TransactionService', `Transaction not found with id: ${id}`);
      throw new NotFoundCustomException('Transaction not found', id);
    }

    Log.info(
      'TransactionService',
      `Transaction with ID ${transaction.id} retrieved successfully`,
    );

    return transaction;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    const transactions = await this.repository.findByUser(userId);

    Log.info(
      'TransactionService',
      `Transactions for USERID ${userId} retrieved successfully`,
    );

    return transactions;
  }
}
