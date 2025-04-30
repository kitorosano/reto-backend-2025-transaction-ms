import { TransactionCurrency } from '../../../common/dto/transaction.dto';
import { Transaction } from '../../../core/domain/models/transaction.model';
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
