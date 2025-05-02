import { Injectable } from '@nestjs/common';
import { RegisterBudgetDTO } from '../../../common/dto/register-budget.dto';
import { Log } from '../../../common/log';
import { Budget } from '../../domain/models/budget.model';
import { BudgetService } from '../../domain/services/budget.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';

@Injectable()
export class RegisterBudgetUseCase {
  constructor(
    private repository: BudgetRepositoryPort,
    private service: BudgetService,
  ) {}

  async execute(dto: RegisterBudgetDTO): Promise<Budget> {
    Log.info(
      'RegisterBudgetUseCase',
      `Creating new budget for USERID ${dto.userId}`,
    );

    const budget = this.service.create({
      userId: dto.userId,
      amount: dto.amount,
      currency: dto.currency,
      category: dto.category,
    });
    const budgetCreated = await this.repository.save(budget);

    Log.info(
      'RegisterBudgetUseCase',
      `Budget created successfully with ID ${budgetCreated.id}`,
    );

    return budgetCreated;
  }
}
