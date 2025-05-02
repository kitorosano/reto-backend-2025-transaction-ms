import { Injectable } from '@nestjs/common';
import { RegisterBudgetDTO } from '../../../common/dto/register-budget.dto';
import { Log } from '../../../common/log';
import { BudgetFactory } from '../../domain/factories/budget.factory';
import { Budget } from '../../domain/models/budget.model';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';

@Injectable()
export class RegisterBudgetUseCase {
  constructor(
    private repository: BudgetRepositoryPort,
    private factory: BudgetFactory,
  ) {}

  async execute(dto: RegisterBudgetDTO): Promise<Budget> {
    Log.info(
      'RegisterBudgetUseCase',
      `Creating new budget for USERID ${dto.userId}`,
    );

    // TODO: Create UUID first and then validate if duplicate budget exists before creating

    const budget = this.factory.createFromDTO(dto);
    const budgetCreated = await this.repository.save(budget);

    Log.info(
      'RegisterBudgetUseCase',
      `Budget created successfully with ID ${budgetCreated.id}`,
    );

    return budgetCreated;
  }
}
