import { Injectable } from '@nestjs/common';
import { TransactionCurrency } from 'src/common/dto/transaction.dto';
import { Transaction } from '../models/transaction.model';

const DEFAULT_CURRENCY = TransactionCurrency.USD;
const DEFAULT_DESCRIPTION = '';
const DEFAULT_CATEGORY = 'uncategorized';

@Injectable()
export class TransactionFactory {
  create(
    userId: string,
    datetime: Date,
    amount: number,
    currency: TransactionCurrency = DEFAULT_CURRENCY,
    category: string = DEFAULT_CATEGORY,
    description: string = DEFAULT_DESCRIPTION,
  ): Transaction {
    const transaction = new Transaction();
    transaction.setUserId(userId);
    transaction.setDatetime(datetime);
    transaction.setAmount(amount);
    transaction.setCurrency(currency);
    transaction.setCategory(category);
    transaction.setDescription(description);

    return transaction;
  }

  createFromDTO(dto: any): Transaction { // TODO: Define a proper DTO type
    const transaction = new Transaction();
    transaction.setUserId(dto.userId);
    transaction.setDatetime(dto.datetime);
    transaction.setAmount(dto.amount);
    transaction.setCurrency(dto.currency || DEFAULT_CURRENCY);
    transaction.setCategory(dto.category || DEFAULT_CATEGORY);
    transaction.setDescription(dto.description || DEFAULT_DESCRIPTION);

    return transaction;
  }
}
