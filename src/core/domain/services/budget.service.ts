import { Injectable } from '@nestjs/common';
import { TransactionCurrency } from '../../../common/dto/transaction.dto';
import { ErrorCodesKeys } from '../../../common/errors/error-code-keys.enum';
import { BadModelException } from '../../../common/errors/exceptions/bad-model.exception';
import { Budget } from '../models/budget.model';
import { UuidService } from './uuid.service';

interface CreateBudget {
  userId: string;
  amount: number;
  currency: TransactionCurrency;
  category: string;
}

@Injectable()
export class BudgetService {
  private readonly DEFAULT_IS_ACTIVE: boolean = false;
  private readonly MAX_CATEGORY_LENGTH = 20;

  constructor(private readonly uuidService: UuidService) {}

  create({ userId, amount, currency, category }: CreateBudget): Budget {
    const budget = new Budget();

    budget.setId(this.uuidService.generate());

    if (this.validateUserId(userId)) budget.setUserId(userId);

    if (this.validateAmount(amount)) budget.setAmount(amount);

    if (this.validateCurrency(currency)) budget.setCurrency(currency);

    if (this.validateCategory(category)) budget.setCategory(category);

    budget.setIsActive(this.DEFAULT_IS_ACTIVE);

    return budget;
  }

  validateId(id: string): boolean {
    const isValid = this.uuidService.validate(id);

    if (!isValid) return true;

    throw new BadModelException(ErrorCodesKeys.ID_FORMAT_NOT_VALID);
  }

  validateUserId(id: string): boolean {
    const isValid = this.uuidService.validate(id);

    if (!isValid) return true;

    throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID);
  }

  private validateAmount(totalIncome: number): boolean {
    const isValid = !isNaN(totalIncome);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for total income validation
  }

  private validateCurrency(currency: TransactionCurrency): boolean {
    const isValid = Object.values(TransactionCurrency).includes(currency);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for currency validation
  }

  private validateCategory(category: string): boolean {
    const isValid =
      category.length > 0 && category.length <= this.MAX_CATEGORY_LENGTH;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for category validation
  }
}
