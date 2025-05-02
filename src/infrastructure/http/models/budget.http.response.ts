import { TransactionCurrency } from '../../../common/dto/transaction.dto';

export class BudgetHTTPResponse {
  id: string;
  category: string;
  amount: number;
  currency: TransactionCurrency;
  isActive: boolean;
}
