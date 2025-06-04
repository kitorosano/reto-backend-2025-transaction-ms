import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { Budget } from '../../domain/models/budget.model';
import { BudgetMapper } from './budget.mapper';

const mockBudget = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  isActive: false,
};

describe('BudgetMapper', () => {
  it('should map Budget model to BudgetDTO', () => {
    const budgetModel = new Budget();
    budgetModel.id = mockBudget.id;
    budgetModel.category = mockBudget.category;
    budgetModel.amount = mockBudget.amount;
    budgetModel.currency = mockBudget.currency;
    budgetModel.isActive = mockBudget.isActive;

    const budgetDTO = BudgetMapper.toDTO(budgetModel);

    expect(budgetDTO).toBeDefined();
    expect(budgetDTO.id).toEqual(budgetModel.id);
    expect(budgetDTO.category).toEqual(budgetModel.category);
    expect(budgetDTO.amount).toEqual(budgetModel.amount);
    expect(budgetDTO.currency).toEqual(budgetModel.currency);
    expect(budgetDTO.isActive).toEqual(budgetModel.isActive);
  });
});
