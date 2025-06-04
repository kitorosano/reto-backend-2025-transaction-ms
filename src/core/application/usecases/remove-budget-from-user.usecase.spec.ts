import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { NotFoundException } from '../../../shared/errors/exceptions/not-found.exception';
import { BudgetService } from '../../domain/services/budget.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';
import { RemoveBudgetFromUserUseCase } from './remove-budget-from-user.usecase';

const mockUserId = 'user-123';
const mockBudgetId = 'd7f85634-18f1-40bd-8265-430eebbfa48e';

const mockBudgetDeleted = {
  id: mockBudgetId,
  userId: mockUserId,
  category: 'travel',
  amount: 200,
  currency: TransactionCurrency.USD,
  isActive: false,
};

const mockDelete = jest.fn().mockResolvedValue(mockBudgetDeleted);
const mockValidateId = jest.fn().mockReturnValue(true);
const mockValidateUserId = jest.fn().mockReturnValue(true);

describe('RemoveBudgetFromUserUseCase', () => {
  let removeBudgetFromUserUseCase: RemoveBudgetFromUserUseCase;
  let repository: BudgetRepositoryPort;
  let service: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveBudgetFromUserUseCase,
        {
          provide: BudgetRepositoryPort,
          useFactory: () => ({
            delete: mockDelete,
          }),
        },
        {
          provide: BudgetService,
          useFactory: () => ({
            validateId: mockValidateId,
            validateUserId: mockValidateUserId,
          }),
        },
      ],
    }).compile();

    removeBudgetFromUserUseCase = module.get<RemoveBudgetFromUserUseCase>(
      RemoveBudgetFromUserUseCase,
    );
    repository = module.get<BudgetRepositoryPort>(BudgetRepositoryPort);
    service = module.get<BudgetService>(BudgetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(removeBudgetFromUserUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should remove a budget from user', async () => {
    const result = await removeBudgetFromUserUseCase.execute(
      mockBudgetId,
      mockUserId,
    );

    expect(result.id).toBe(mockBudgetDeleted.id);
    expect(result.userId).toBe(mockBudgetDeleted.userId);
    expect(result.category).toBe(mockBudgetDeleted.category);
    expect(result.amount).toBe(mockBudgetDeleted.amount);
    expect(result.currency).toBe(mockBudgetDeleted.currency);
    expect(result.isActive).toBe(mockBudgetDeleted.isActive);

    expect(service.validateId).toHaveBeenCalledWith(mockBudgetId);
    expect(service.validateUserId).toHaveBeenCalledWith(mockUserId);
    expect(repository.delete).toHaveBeenCalledWith(mockBudgetId, mockUserId);
  });

  it('should throw NotFoundException if delete returns null', async () => {
    mockDelete.mockResolvedValueOnce(null);

    await expect(
      removeBudgetFromUserUseCase.execute(mockBudgetId, mockUserId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadModelException if budget ID is invalid', async () => {
    mockDelete.mockRejectedValueOnce(
      new BadModelException(ErrorCodesKeys.ID_FORMAT_NOT_VALID),
    );

    await expect(
      removeBudgetFromUserUseCase.execute('invalid-id', mockUserId),
    ).rejects.toThrow(BadModelException);
  });

  it('should throw BadModelException if user does not exist', async () => {
    mockDelete.mockRejectedValueOnce(
      new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID),
    );

    await expect(
      removeBudgetFromUserUseCase.execute(mockBudgetId, 'non-existent-user'),
    ).rejects.toThrow(BadModelException);
  });
});
