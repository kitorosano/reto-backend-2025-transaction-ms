import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { BudgetService } from '../../domain/services/budget.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';
import { GetUserBudgetsUseCase } from './get-user-budgets.usecase';

const userId = 'user-123';

const mockBudget = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  userId,
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  isActive: false,
};

const mockFindByUser = jest.fn().mockResolvedValue([mockBudget]);
const mockValidateUserId = jest.fn().mockReturnValue(true);

describe('GetUserBudgetsUseCase', () => {
  let getUserBudgetsUseCase: GetUserBudgetsUseCase;
  let repository: BudgetRepositoryPort;
  let service: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserBudgetsUseCase,
        {
          provide: BudgetRepositoryPort,
          useFactory: () => ({
            findByUser: mockFindByUser,
          }),
        },
        {
          provide: BudgetService,
          useFactory: () => ({
            validateUserId: mockValidateUserId,
          }),
        },
      ],
    }).compile();

    getUserBudgetsUseCase = module.get<GetUserBudgetsUseCase>(
      GetUserBudgetsUseCase,
    );
    repository = module.get<BudgetRepositoryPort>(BudgetRepositoryPort);
    service = module.get<BudgetService>(BudgetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getUserBudgetsUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return user budgets', async () => {
    const result = await getUserBudgetsUseCase.execute(userId);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(mockBudget.id);
    expect(result[0].userId).toBe(mockBudget.userId);
    expect(result[0].category).toBe(mockBudget.category);
    expect(result[0].amount).toBe(mockBudget.amount);
    expect(result[0].currency).toBe(mockBudget.currency);
    expect(result[0].isActive).toBe(mockBudget.isActive);

    expect(service.validateUserId).toHaveBeenCalledWith(userId);
    expect(repository.findByUser).toHaveBeenCalledWith(userId);
  });

  it('should throw BadModelException if userId is invalid', async () => {
    mockValidateUserId.mockImplementationOnce(() => {
      throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID);
    });

    await expect(getUserBudgetsUseCase.execute(userId)).rejects.toThrow(
      BadModelException,
    );
  });
});
