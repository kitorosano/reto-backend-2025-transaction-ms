import { Transaction } from '../models/transaction.model';

export abstract class TransactionRepositoryPort {
  abstract save(transaction: Transaction): Promise<Transaction>;

  abstract findById(id: string): Promise<Transaction | null>;

  abstract findByUser(userId: string): Promise<Transaction[]>;
}
