import { TransactionCurrency } from './transaction.dto';

export class BudgetDTO {
  id: string;
  userId: string;
  amount: number;
  currency: TransactionCurrency;
  category: string;
}
