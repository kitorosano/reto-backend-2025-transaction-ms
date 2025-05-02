import { Injectable } from '@nestjs/common';
import { Log } from 'src/common/log';
import { Budget } from '../../domain/models/budget.model';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';

@Injectable()
export class GetUserBudgetsUseCase {
  constructor(private repository: BudgetRepositoryPort) {}

  async execute(userId: string): Promise<Budget[]> {
    Log.info('GetUserBudgetsUseCase', `Getting budgets for userId ${userId}`);

    // TODO: Create UUID Value-Object first and then validate

    const budgets = await this.repository.findByUser(userId);

    Log.info(
      'GetUserBudgetsUseCase',
      `Budgets (${budgets.length}) retrieved successfully, for USERID ${userId}`,
    );

    return budgets;
  }
}
