import { TransactionCurrency } from './transaction.dto';

export class CreateTransactionDTO {
  userId: string;
  datetime: Date;
  amount: number;
  currency: TransactionCurrency;
  category: string;
  description?: string;
}
