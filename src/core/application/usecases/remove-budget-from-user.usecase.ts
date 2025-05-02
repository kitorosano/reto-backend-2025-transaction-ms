import { Injectable } from '@nestjs/common';
import { ModifyBudgetDTO } from '../../../common/dto/modify-budget.dto';
import { ErrorCodesKeys } from '../../../common/errors/error-code-keys.enum';
import { NotFoundException } from '../../../common/errors/exceptions/not-found.exception';
import { Log } from '../../../common/log';
import { Budget } from '../../domain/models/budget.model';
import { BudgetService } from '../../domain/services/budget.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';

@Injectable()
export class RemoveBudgetFromUserUseCase {
  constructor(
    private repository: BudgetRepositoryPort,
    private service: BudgetService,
  ) {}

  async execute(id: string, userId: string): Promise<Budget> {
    Log.info(
      'RemoveBudgetFromUserUseCase',
      `Removing budget with ID ${id} from USERID ${userId}`,
    );
    
    this.service.validateId(id);
    this.service.validateUserId(userId);

    const budgetRemoved = await this.repository.delete(id, userId);

    if (!budgetRemoved) {
      Log.error('RemoveBudgetFromUserUseCase', `Budget with ID ${id} not found`);
      throw new NotFoundException(ErrorCodesKeys.BUDGET_NOT_FOUND);
    }

    Log.info(
      'RemoveBudgetFromUserUseCase',
      `Budget with ID ${budgetRemoved.id} removed successfully from USERID ${budgetRemoved.userId}`,
    );

    return budgetRemoved;
  }
}
