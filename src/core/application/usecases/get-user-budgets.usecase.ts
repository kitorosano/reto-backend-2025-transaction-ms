import { Injectable } from '@nestjs/common';
import { Log } from '../../../shared/utils/log';
import { Budget } from '../../domain/models/budget.model';
import { BudgetService } from '../../domain/services/budget.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';

@Injectable()
export class GetUserBudgetsUseCase {
  constructor(
    private repository: BudgetRepositoryPort,
    private service: BudgetService,
  ) {}

  async execute(userId: string): Promise<Budget[]> {
    Log.info('GetUserBudgetsUseCase', `Getting budgets for userId ${userId}`);

    this.service.validateUserId(userId);

    const budgets = await this.repository.findByUser(userId);

    Log.info(
      'GetUserBudgetsUseCase',
      `Budgets (${budgets.length}) retrieved successfully, for USERID ${userId}`,
    );

    return budgets;
  }
}
