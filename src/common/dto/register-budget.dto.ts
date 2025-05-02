import { TransactionCurrency } from './transaction.dto';

export class RegisterBudgetDTO {
  userId: string;
  amount: number;
  currency: TransactionCurrency;
  category: string;
}
