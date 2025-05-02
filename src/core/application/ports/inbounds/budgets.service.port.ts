import { BudgetDTO } from '../../../../common/dto/budget.dto';
import { RegisterBudgetDTO } from '../../../../common/dto/register-budget.dto';

export abstract class BudgetsServicePort {
  abstract registerBudget(budget: RegisterBudgetDTO): Promise<BudgetDTO>;
  abstract getUserBudgets(userId: string): Promise<BudgetDTO[]>;
  // abstract updateBudget(budgetId: string, budget: RegisterBudgetDTO): Promise<BudgetDTO>;
}
