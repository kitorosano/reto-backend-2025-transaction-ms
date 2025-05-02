import { BudgetDTO } from '../../../../common/dto/budget.dto';
import { RegisterBudgetDTO } from '../../../../common/dto/register-budget.dto';

export abstract class BudgetsServicePort {
  abstract registerBudget(budget: RegisterBudgetDTO): Promise<BudgetDTO>;
  abstract getBudgetsByUser(userId: string): Promise<BudgetDTO[]>;
}
