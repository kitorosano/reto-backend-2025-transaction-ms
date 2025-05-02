import { Budget } from '../../../domain/models/budget.model';
export abstract class BudgetRepositoryPort {
  abstract save(budget: Budget): Promise<Budget>;

  abstract findByUser(userId: string): Promise<Budget[]>;

  abstract findByUserAndCategory(
    userId: string,
    category: string,
  ): Promise<Budget | null>;

  abstract update(budget: Budget): Promise<Budget | null>;

  abstract delete(id: string, userId: string): Promise<Budget | null>;
}
