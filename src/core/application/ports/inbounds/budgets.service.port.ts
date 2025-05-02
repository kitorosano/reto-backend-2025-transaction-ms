import { BudgetDTO } from '../../../../common/dto/budget.dto';
import { RegisterBudgetDTO } from '../../../../common/dto/register-budget.dto';
import { ModifyBudgetDTO } from '../../../../common/dto/modify-budget.dto';

export abstract class BudgetsServicePort {
  abstract registerBudget(budget: RegisterBudgetDTO): Promise<BudgetDTO>;

  abstract getUserBudgets(userId: string): Promise<BudgetDTO[]>;
  
  abstract modifyUserBudget(
    budgetId: string,
    budget: ModifyBudgetDTO,
  ): Promise<BudgetDTO>;
}
