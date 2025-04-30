import { CreateTransactionDTO } from '../../../../common/dto/create-transaction.dto';
import { TransactionDTO } from '../../../../common/dto/transaction.dto';

export abstract class TransactionServicePort {
  abstract createTransaction(
    transaction: CreateTransactionDTO,
  ): Promise<TransactionDTO>;

  abstract getTransactionById(id: string): Promise<TransactionDTO>;

  abstract getTransactionsByUser(userId: string): Promise<TransactionDTO[]>;
}
