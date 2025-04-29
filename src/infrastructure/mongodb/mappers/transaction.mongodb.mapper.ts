import { Transaction } from '../../../domain/models/transaction.model';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { TransactionMongoDBDocument } from '../entities/transaction.mongodb.entity';

export class TransactionMongoDBMapper {
  static toModel(entity: TransactionMongoDBDocument): Transaction {
    const transaction = new Transaction();

    transaction.id = entity.id;
    transaction.category = entity.category;
    transaction.amount = entity.amount;
    transaction.currency = TransactionCurrency[entity.currency];
    transaction.datetime = entity.datetime;
    transaction.description = entity.description;
    transaction.userId = entity.userId;

    return transaction;
  }
}

// TODO: Can this be an injectable class?
