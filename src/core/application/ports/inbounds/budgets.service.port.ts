import { BudgetDTO } from '../../../../common/dto/budget.dto';
import { ModifyBudgetDTO } from '../../../../common/dto/modify-budget.dto';
import { RegisterBudgetDTO } from '../../../../common/dto/register-budget.dto';

export abstract class BudgetsServicePort {
  abstract registerBudget(budget: RegisterBudgetDTO): Promise<BudgetDTO>;

  abstract getUserBudgets(userId: string): Promise<BudgetDTO[]>;

  abstract modifyUserBudget(
    id: string,
    budget: ModifyBudgetDTO,
  ): Promise<BudgetDTO>;

  abstract removeUserBudget(id: string, userId: string): Promise<void>;
}
