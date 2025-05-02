import { TransactionCurrency } from '../../../common/dto/transaction.dto';
import { Budget } from '../../../core/domain/models/budget.model';
import { BudgetMongoDBDocument } from '../entities/budget.mongodb.entity';

export class BudgetMongoDBMapper {
  static toModel(entity: BudgetMongoDBDocument): Budget {
    const budget = new Budget();

    budget.id = entity.id;
    budget.userId = entity.userId;
    budget.amount = entity.amount;
    budget.currency = TransactionCurrency[entity.currency];
    budget.category = entity.category;
    budget.isActive = entity.isActive;

    return budget;
  }
}
