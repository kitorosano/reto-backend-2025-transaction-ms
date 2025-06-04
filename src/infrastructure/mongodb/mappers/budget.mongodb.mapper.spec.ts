import { BudgetMongoDBDocument } from '../entities/budget.mongodb.entity';
import { BudgetMongoDBMapper } from './budget.mongodb.mapper';

const mockBudgetDocument = {
  id: 'uuid',
  userId: 'user123',
  category: 'house',
  amount: 100,
  currency: 'USD',
  isActive: true,
} as BudgetMongoDBDocument;

const mockBudgetResponse = {
  id: mockBudgetDocument.id,
  userId: mockBudgetDocument.userId,
  category: mockBudgetDocument.category,
  amount: mockBudgetDocument.amount,
  currency: mockBudgetDocument.currency,
  isActive: mockBudgetDocument.isActive,
};

describe('BudgetMongoDBMapper', () => {
  it('should map BudgetMongoDBDocument to Budget', () => {
    const model = BudgetMongoDBMapper.toModel(mockBudgetDocument);

    expect(model).toBeDefined();
    expect(model.id).toEqual(mockBudgetResponse.id);
    expect(model.userId).toEqual(mockBudgetResponse.userId);
    expect(model.category).toEqual(mockBudgetResponse.category);
    expect(model.amount).toEqual(mockBudgetResponse.amount);
    expect(model.currency).toEqual(mockBudgetResponse.currency);
    expect(model.isActive).toEqual(mockBudgetResponse.isActive);
  });
});
