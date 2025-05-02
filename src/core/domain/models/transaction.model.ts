import { TransactionCurrency } from '../../../common/dto/transaction.dto';

export class Transaction {
  id: string;
  userId: string;
  category: string;
  amount: number;
  // type: string; // TODO: add field "type" (income/expense)
  currency: TransactionCurrency;
  datetime: Date; // TODO: rename to "date"
  description: string;

  setId(id: string) {
    this.id = id;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setCategory(category: string) {
    this.category = category;
  }

  setAmount(amount: number) {
    this.amount = amount;
  }

  setCurrency(currency: TransactionCurrency) {
    this.currency = currency;
  }

  setDatetime(datetime: Date) {
    this.datetime = datetime;
  }

  setDescription(description: string) {
    this.description = description;
  }
}
