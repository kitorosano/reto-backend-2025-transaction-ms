import { Injectable } from '@nestjs/common';
import { ModifyBudgetDTO } from '../../../shared/dto/modify-budget.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { NotFoundException } from '../../../shared/errors/exceptions/not-found.exception';
import { Log } from '../../../shared/utils/log';
import { Budget } from '../../domain/models/budget.model';
import { BudgetService } from '../../domain/services/budget.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';

@Injectable()
export class ModifyBudgetUseCase {
  constructor(
    private repository: BudgetRepositoryPort,
    private service: BudgetService,
  ) {}

  async execute(id: string, dto: ModifyBudgetDTO): Promise<Budget> {
    Log.info(
      'ModifyBudgetUseCase',
      `Modifying budget with ID ${id} for USERID ${dto.userId}`,
    );

    const budget = this.service.modify({
      id,
      userId: dto.userId,
      amount: dto.amount,
      currency: dto.currency,
      category: dto.category,
      isActive: dto.isActive,
    });

    const budgetUpdated = await this.repository.update(budget);

    if (!budgetUpdated) {
      Log.error('ModifyBudgetUseCase', `Budget with ID ${id} not found`);
      throw new NotFoundException(ErrorCodesKeys.BUDGET_NOT_FOUND);
    }

    Log.info(
      'ModifyBudgetUseCase',
      `Budget modified successfully with ID ${budgetUpdated.id}`,
    );

    return budgetUpdated;
  }
}
