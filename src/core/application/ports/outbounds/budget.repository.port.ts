import { Budget } from '../../../domain/models/budget.model';
export abstract class BudgetRepositoryPort {
  abstract save(budget: Budget): Promise<Budget>;
  
  abstract findByUser(userId: string): Promise<Budget[]>;
}
