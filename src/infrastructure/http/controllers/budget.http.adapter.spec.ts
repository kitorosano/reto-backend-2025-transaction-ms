import { Test, TestingModule } from '@nestjs/testing';
import { BudgetServicePort } from '../../../core/application/ports/inbounds/budget.service.port';
import { AuthServicePort } from '../../../core/application/ports/outbounds/auth.service.port';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { BudgetHTTPAdapter } from './budget.http.adapter';

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
  category: mockRegisterBudgetDTO.category,
  amount: mockRegisterBudgetDTO.amount,
  currency: mockRegisterBudgetDTO.currency,
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

const mockBudgetModifiedDTO = {
  id: mockBudgetDTO.id,
  userId: mockUserId,
  amount: mockModifyBudgetDTO.amount,
  isActive: mockModifyBudgetDTO.isActive,
  category: mockBudgetDTO.category,
  currency: mockBudgetDTO.currency,
};

const mockBudgetResponse = {
  id: mockBudgetDTO.id,
  category: mockBudgetDTO.category,
  amount: mockBudgetDTO.amount,
  currency: mockBudgetDTO.currency,
  isActive: mockBudgetDTO.isActive,
};

const mockModifyBudgetResponse = {
  id: mockBudgetModifiedDTO.id,
  category: mockBudgetDTO.category,
  amount: mockModifyBudgetRequest.amount,
  currency: mockBudgetDTO.currency,
  isActive: mockModifyBudgetRequest.isActive,
};

const mockRegisterBudget = jest.fn().mockResolvedValue(mockBudgetDTO);
const mockGetUserBudgets = jest.fn().mockResolvedValue([mockBudgetDTO]);
const mockModifyBudget = jest.fn().mockResolvedValue(mockBudgetModifiedDTO);
const mockRemoveBudgetFromUser = jest.fn().mockResolvedValue(undefined);

describe('BudgetHTTPAdapter', () => {
  let controller: BudgetHTTPAdapter;
  let application: BudgetServicePort;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BudgetHTTPAdapter],
      providers: [
        {
          provide: BudgetServicePort,
          useFactory: () => ({
            registerBudget: mockRegisterBudget,
            getUserBudgets: mockGetUserBudgets,
            modifyUserBudget: mockModifyBudget,
            removeUserBudget: mockRemoveBudgetFromUser,
          }),
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: AuthServicePort,
          useFactory: () => ({
            verifyToken: jest.fn().mockResolvedValue({
              userId: mockUserId,
              email: 'email',
              name: 'name',
            }),
          }),
        },
      ],
    }).compile();

    controller = app.get<BudgetHTTPAdapter>(BudgetHTTPAdapter);
    application = app.get<BudgetServicePort>(BudgetServicePort);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(application).toBeDefined();
  });

  it('should register a budget', async () => {
    const response = await controller.registerBudget(
      mockRegisterBudgetRequest,
      mockUserId,
    );

    expect(response).toBeDefined();
    expect(response.id).toBe(mockBudgetResponse.id);
    expect(response.category).toBe(mockBudgetResponse.category);
    expect(response.amount).toBe(mockBudgetResponse.amount);
    expect(response.currency).toBe(mockBudgetResponse.currency);
    expect(response.isActive).toBe(mockBudgetResponse.isActive);

    expect(mockRegisterBudget).toHaveBeenCalledWith(mockRegisterBudgetDTO);
  });

  it('should get user budgets', async () => {
    const response = await controller.getUserBudgets(mockUserId);

    expect(response).toBeDefined();
    expect(response.length).toBe(1);
    expect(response[0].id).toBe(mockBudgetResponse.id);
    expect(response[0].category).toBe(mockBudgetResponse.category);
    expect(response[0].amount).toBe(mockBudgetResponse.amount);
    expect(response[0].currency).toBe(mockBudgetResponse.currency);
    expect(response[0].isActive).toBe(mockBudgetResponse.isActive);

    expect(mockGetUserBudgets).toHaveBeenCalledWith(mockUserId);
  });

  it('should modify a user budget', async () => {
    const response = await controller.modifyUserBudget(
      mockModifyBudgetRequest,
      mockBudgetDTO.id,
      mockUserId,
    );

    expect(response).toBeDefined();
    expect(response.id).toBe(mockModifyBudgetResponse.id);
    expect(response.category).toBe(mockModifyBudgetResponse.category);
    expect(response.amount).toBe(mockModifyBudgetResponse.amount);
    expect(response.currency).toBe(mockModifyBudgetResponse.currency);
    expect(response.isActive).toBe(mockModifyBudgetResponse.isActive);

    expect(mockModifyBudget).toHaveBeenCalledWith(
      mockBudgetDTO.id,
      mockModifyBudgetDTO,
    );
  });

  it('should remove a user budget', async () => {
    const response = await controller.removeUserBudget(
      mockBudgetDTO.id,
      mockUserId,
    );

    expect(response).toBeUndefined();

    expect(mockRemoveBudgetFromUser).toHaveBeenCalledWith(
      mockBudgetDTO.id,
      mockUserId,
    );
  });
});
