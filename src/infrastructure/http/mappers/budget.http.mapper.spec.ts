import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { BudgetHTTPMapper } from './budget.http.mapper';

const mockUserId = 'user123';

const mockRegisterBudgetRequest = {
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  userId: mockUserId,
};

const mockRegisterBudgetDTO = {
  userId: mockUserId,
  amount: mockRegisterBudgetRequest.amount,
  category: mockRegisterBudgetRequest.category,
  currency: mockRegisterBudgetRequest.currency,
};

const mockBudgetDTO = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  userId: mockUserId,
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  isActive: false,
};

const mockModifyBudgetRequest = {
  amount: 200,
  isActive: true,
};

const mockModifyBudgetDTO = {
  userId: mockUserId,
  amount: mockModifyBudgetRequest.amount,
  isActive: mockModifyBudgetRequest.isActive,
  category: undefined,
  currency: undefined,
};

const mockBudgetResponse = {
  id: mockBudgetDTO.id,
  category: mockBudgetDTO.category,
  amount: mockBudgetDTO.amount,
  currency: mockBudgetDTO.currency,
  isActive: mockBudgetDTO.isActive,
};

describe('BudgetHTTPMapper', () => {
  it('should map RegisterBudgetHTTPRequest to RegisterBudgetDTO', () => {
    const dto = BudgetHTTPMapper.toRegisterDTO(
      mockRegisterBudgetRequest,
      mockUserId,
    );

    expect(dto).toBeDefined();
    expect(dto.category).toEqual(mockRegisterBudgetDTO.category);
    expect(dto.amount).toEqual(mockRegisterBudgetDTO.amount);
    expect(dto.currency).toEqual(mockRegisterBudgetDTO.currency);
    expect(dto.userId).toEqual(mockRegisterBudgetDTO.userId);
  });

  it('should map ModifyBudgetHTTPRequest to ModifyBudgetDTO', () => {
    const dto = BudgetHTTPMapper.toModifyDTO(
      mockModifyBudgetRequest,
      mockUserId,
    );

    expect(dto).toBeDefined();
    expect(dto.category).toEqual(mockModifyBudgetDTO.category);
    expect(dto.amount).toEqual(mockModifyBudgetDTO.amount);
    expect(dto.currency).toEqual(mockModifyBudgetDTO.currency);
    expect(dto.userId).toEqual(mockModifyBudgetDTO.userId);
  });

  it('should map BudgetDTO to BudgetHTTPResponse', () => {
    const response = BudgetHTTPMapper.toResponse(mockBudgetDTO);

    expect(response).toBeDefined();
    expect(response.id).toEqual(mockBudgetResponse.id);
    expect(response.category).toEqual(mockBudgetResponse.category);
    expect(response.amount).toEqual(mockBudgetResponse.amount);
    expect(response.currency).toEqual(mockBudgetResponse.currency);
    expect(response.isActive).toEqual(mockBudgetResponse.isActive);
  });
});
