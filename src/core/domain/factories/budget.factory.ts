import { Injectable } from '@nestjs/common';
import { RegisterBudgetDTO } from '../../../common/dto/register-budget.dto';
import { TransactionCurrency } from '../../../common/dto/transaction.dto';
import { Budget } from '../models/budget.model';

const DEFAULT_CURRENCY = TransactionCurrency.USD; // TODO: This should be imported from a config file or environment variable
const DEFAULT_IS_ACTIVE = false;

@Injectable()
export class BudgetFactory {
  create(
    userId: string,
    amount: number,
    currency: TransactionCurrency = DEFAULT_CURRENCY,
    category: string,
  ): Budget {
    const budget = new Budget();

    budget.setUserId(userId);
    budget.setAmount(amount);
    budget.setCurrency(currency);
    budget.setCategory(category);
    budget.setIsActive(DEFAULT_IS_ACTIVE);

    return budget;
  }

  createFromDTO(dto: RegisterBudgetDTO): Budget {
    const budget = new Budget();

    budget.setUserId(dto.userId);
    budget.setAmount(dto.amount);
    budget.setCurrency(dto.currency || DEFAULT_CURRENCY);
    budget.setCategory(dto.category);
    budget.setIsActive(DEFAULT_IS_ACTIVE);

    return budget;
  }
}
