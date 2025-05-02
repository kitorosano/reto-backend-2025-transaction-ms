import { CreateTransactionDTO } from '../../../../shared/dto/create-transaction.dto';
import { TransactionDTO } from '../../../../shared/dto/transaction.dto';

export abstract class TransactionServicePort {
  abstract createTransaction(
    transaction: CreateTransactionDTO,
  ): Promise<TransactionDTO>;

  abstract getTransaction(id: string): Promise<TransactionDTO>;

  abstract getUserTransactionHistory(userId: string): Promise<TransactionDTO[]>;
}
