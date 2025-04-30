import { TransactionCurrency } from './transaction.dto';

export class CreateTransactionDTO {
  category: string;
  amount: number;
  currency?: TransactionCurrency;
  datetime: Date;
  description?: string;
  userId: string;
}
