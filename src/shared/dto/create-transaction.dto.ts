import { TransactionCurrency } from './transaction.dto';

export class RegisterTransactionDTO {
  userId: string;
  datetime: Date;
  amount: number;
  currency: TransactionCurrency;
  category: string;
  description?: string;
}
