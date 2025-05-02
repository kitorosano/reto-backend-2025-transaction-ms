import { BudgetDTO } from '../../../../shared/dto/budget.dto';
import { ModifyBudgetDTO } from '../../../../shared/dto/modify-budget.dto';
import { RegisterBudgetDTO } from '../../../../shared/dto/register-budget.dto';

export abstract class BudgetServicePort {
  abstract registerBudget(budget: RegisterBudgetDTO): Promise<BudgetDTO>;

  abstract getUserBudgets(userId: string): Promise<BudgetDTO[]>;

  abstract modifyUserBudget(
    id: string,
    budget: ModifyBudgetDTO,
  ): Promise<BudgetDTO>;

  abstract removeUserBudget(id: string, userId: string): Promise<void>;
}
