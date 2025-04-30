import { Transaction } from '../../../domain/models/transaction.model';
export abstract class TransactionRepositoryPort {
  abstract save(transaction: Transaction): Promise<Transaction>;

  abstract findById(id: string): Promise<Transaction | null>;

  abstract findByUser(userId: string): Promise<Transaction[]>;

  abstract findByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]>;
}
