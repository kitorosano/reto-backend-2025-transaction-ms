import { TransactionCurrency } from '../../../shared/dto/transaction.dto';

export class Budget {
  id: string;
  userId: string;
  amount: number;
  currency: TransactionCurrency;
  category: string;
  isActive: boolean;

  setId(id: string) {
    this.id = id;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setAmount(amount: number) {
    this.amount = amount;
  }

  setCurrency(currency: TransactionCurrency) {
    this.currency = currency;
  }

  setCategory(category: string) {
    this.category = category;
  }

  setIsActive(isActive: boolean) {
    this.isActive = isActive;
  }
}
