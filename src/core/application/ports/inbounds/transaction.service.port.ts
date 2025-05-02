import { RegisterTransactionDTO } from '../../../../shared/dto/create-transaction.dto';
import { TransactionDTO } from '../../../../shared/dto/transaction.dto';

export abstract class TransactionServicePort {
  abstract registerTransaction(
    transaction: RegisterTransactionDTO,
  ): Promise<TransactionDTO>;

  abstract getTransaction(id: string): Promise<TransactionDTO>;

  abstract getUserTransactionHistory(userId: string): Promise<TransactionDTO[]>;
}
