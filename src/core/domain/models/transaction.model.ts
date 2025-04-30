import { TransactionCurrency } from '../../../common/dto/transaction.dto';
import { InvalidModelPropertyValueException } from '../../../common/exceptions/domain.exceptions';

export class Transaction {
  id: string;
  category: string;
  amount: number;
  currency: TransactionCurrency;
  datetime: Date;
  description: string;
  userId: string;

  // Business logic

  // Setters

  setId(id: string) {
    this.id = id;
  }

  setCategory(category: string) {
    if (!category) {
      throw new InvalidModelPropertyValueException('Category cannot be empty');
    }
    this.category = category;
  }

  setAmount(amount: number) {
    if (!amount) {
      throw new InvalidModelPropertyValueException('Amount cannot be empty');
    }
    this.amount = amount;
  }

  setCurrency(currency: TransactionCurrency) {
    if (!currency) {
      throw new InvalidModelPropertyValueException('Currency cannot be empty');
    }
    this.currency = currency;
  }

  setDatetime(datetime: Date) {
    if (!datetime) {
      throw new InvalidModelPropertyValueException('Datetime cannot be empty');
    }
    this.datetime = datetime;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }
}
