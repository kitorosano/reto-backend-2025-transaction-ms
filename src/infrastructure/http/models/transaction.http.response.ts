import { TransactionCurrency } from '../../../shared/dto/transaction.dto';

export class TransactionHTTPResponse {
  id: string;
  category: string;
  amount: number;
  currency: TransactionCurrency;
  date: Date;
  description: string;
}
