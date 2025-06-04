import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { NotFoundException } from '../../../shared/errors/exceptions/not-found.exception';
import { BudgetService } from '../../domain/services/budget.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';
import { ModifyBudgetUseCase } from './modify-budget.usecase';

const mockUserId = 'user-123';
const mockBudgetId = 'd7f85634-18f1-40bd-8265-430eebbfa48e';

const mockModifyBudgetDTO = {
  userId: mockUserId,
  category: 'travel',
  amount: 200,
};

const mockBudgetModified = {
  id: mockBudgetId,
  userId: mockUserId,
  category: mockModifyBudgetDTO.category,
  amount: mockModifyBudgetDTO.amount,
  currency: TransactionCurrency.USD,
  isActive: false,
};

const mockUpdate = jest.fn().mockResolvedValue(mockBudgetModified);
const mockModify = jest.fn().mockReturnValue(mockBudgetModified);

describe('ModifyBudgetUseCase', () => {
  let modifyBudgetUseCase: ModifyBudgetUseCase;
  let repository: BudgetRepositoryPort;
  let service: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModifyBudgetUseCase,
        {
          provide: BudgetRepositoryPort,
          useFactory: () => ({
            update: mockUpdate,
          }),
        },
        {
          provide: BudgetService,
          useFactory: () => ({
            modify: mockModify,
          }),
        },
      ],
    }).compile();

    modifyBudgetUseCase = module.get<ModifyBudgetUseCase>(ModifyBudgetUseCase);
    repository = module.get<BudgetRepositoryPort>(BudgetRepositoryPort);
    service = module.get<BudgetService>(BudgetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(modifyBudgetUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should modify a budget and return the modified budget', async () => {
    const result = await modifyBudgetUseCase.execute(
      mockBudgetId,
      mockModifyBudgetDTO,
    );

    expect(result.id).toBe(mockBudgetModified.id);
    expect(result.userId).toBe(mockBudgetModified.userId);
    expect(result.category).toBe(mockBudgetModified.category);
    expect(result.amount).toBe(mockBudgetModified.amount);
    expect(result.currency).toBe(mockBudgetModified.currency);
    expect(result.isActive).toBe(mockBudgetModified.isActive);

    const expectedModifyCall = {
      id: mockBudgetId,
      userId: mockUserId,
      category: mockModifyBudgetDTO.category,
      amount: mockModifyBudgetDTO.amount,
      currency: undefined,
      isActive: undefined,
    };

    expect(service.modify).toHaveBeenCalledWith(expectedModifyCall);
    expect(repository.update).toHaveBeenCalledWith(mockBudgetModified);
  });

  it('should throw NotFoundException if update returns null', async () => {
    mockUpdate.mockResolvedValueOnce(null);

    await expect(
      modifyBudgetUseCase.execute(mockBudgetId, mockModifyBudgetDTO),
    ).rejects.toThrow(NotFoundException);
  });
});
