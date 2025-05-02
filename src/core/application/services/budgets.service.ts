import { Injectable } from '@nestjs/common';
import { BudgetDTO } from '../../../common/dto/budget.dto';
import { RegisterBudgetDTO } from '../../../common/dto/register-budget.dto';
import { BudgetMapper } from '../mappers/budget.mapper';
import { BudgetsServicePort } from '../ports/inbounds/budgets.service.port';
import { RegisterBudgetUseCase } from '../usecases/register-budget.usecase';

@Injectable()
export class BudgetsService implements BudgetsServicePort {
  constructor(private readonly registerBudgetUseCase: RegisterBudgetUseCase) {}

  async registerBudget(dto: RegisterBudgetDTO): Promise<BudgetDTO> {
    const budget = await this.registerBudgetUseCase.execute(dto);
    return BudgetMapper.toDTO(budget);
  }
}
