import { TransactionCurrency } from './transaction.dto';

export class ModifyBudgetDTO {
  userId: string;
  amount?: number;
  currency?: TransactionCurrency;
  category?: string;
  isActive?: boolean;
}
