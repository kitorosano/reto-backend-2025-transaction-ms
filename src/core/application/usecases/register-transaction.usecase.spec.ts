import { Test, TestingModule } from '@nestjs/testing';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { TransactionService } from '../../domain/services/transaction.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';
import { RegisterTransactionUseCase } from './register-transaction.usecase';

const userId = 'user-123';

const mockRegisterTransactionDTO = {
  userId,
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  datetime: new Date('2025-05-01T00:00:00Z'),
  description: 'monthly bill',
};

const mockTransaction = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  userId,
  category: mockRegisterTransactionDTO.category,
  amount: mockRegisterTransactionDTO.amount,
  currency: mockRegisterTransactionDTO.currency,
  datetime: mockRegisterTransactionDTO.datetime,
  description: mockRegisterTransactionDTO.description,
};

const mockStartDate = new Date(
  mockTransaction.datetime.getFullYear(),
  mockTransaction.datetime.getMonth(),
  1,
);
const mockEndDate = new Date(
  mockTransaction.datetime.getFullYear(),
  mockTransaction.datetime.getMonth() + 1,
  0,
);

const mockBudget = {
  id: 'd4c7cc42-1fcb-4fda-807c-b1e36083a608',
  userId,
  category: mockRegisterTransactionDTO.category,
  amount: 1,
  currency: TransactionCurrency.USD,
  isActive: true,
};

const mockFindByUserAndDateRangeAndCategory = jest.fn().mockResolvedValue(null);
const mockSave = jest.fn().mockResolvedValue(mockTransaction);

const mockFindByUserAndCategory = jest.fn().mockResolvedValue(null);

const mockCreate = jest.fn().mockReturnValue(mockTransaction);

describe('RegisterTransactionUseCase', () => {
  let registerTransactionUseCase: RegisterTransactionUseCase;
  let transactionRepository: TransactionRepositoryPort;
  let budgetRepository: BudgetRepositoryPort;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterTransactionUseCase,
        {
          provide: TransactionRepositoryPort,
          useFactory: () => ({
            findByUserAndDateRangeAndCategory:
              mockFindByUserAndDateRangeAndCategory,
            save: mockSave,
          }),
        },
        {
          provide: BudgetRepositoryPort,
          useFactory: () => ({
            findByUserAndCategory: mockFindByUserAndCategory,
          }),
        },
        {
          provide: TransactionService,
          useFactory: () => ({
            create: mockCreate,
          }),
        },
      ],
    }).compile();

    registerTransactionUseCase = module.get<RegisterTransactionUseCase>(
      RegisterTransactionUseCase,
    );
    transactionRepository = module.get<TransactionRepositoryPort>(
      TransactionRepositoryPort,
    );
    budgetRepository = module.get<BudgetRepositoryPort>(BudgetRepositoryPort);
    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(registerTransactionUseCase).toBeDefined();
    expect(transactionRepository).toBeDefined();
    expect(budgetRepository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should register a transaction successfully', async () => {
    const result = await registerTransactionUseCase.execute(
      mockRegisterTransactionDTO,
    );

    expect(result.id).toBe(mockTransaction.id);
    expect(result.userId).toBe(mockTransaction.userId);
    expect(result.category).toBe(mockTransaction.category);
    expect(result.amount).toBe(mockTransaction.amount);
    expect(result.currency).toBe(mockTransaction.currency);
    expect(result.datetime).toEqual(mockTransaction.datetime);
    expect(result.description).toBe(mockTransaction.description);

    expect(budgetRepository.findByUserAndCategory).toHaveBeenCalledWith(
      userId,
      mockRegisterTransactionDTO.category,
    );
    expect(
      transactionRepository.findByUserAndDateRangeAndCategory,
    ).not.toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(mockRegisterTransactionDTO);
    expect(transactionRepository.save).toHaveBeenCalledWith(mockTransaction);
  });

  it('should throw an error if the transaction amount exceeds the budget', async () => {
    mockFindByUserAndCategory.mockResolvedValueOnce(mockBudget);
    mockFindByUserAndDateRangeAndCategory.mockResolvedValueOnce([mockTransaction]);

    await expect(
      registerTransactionUseCase.execute(mockRegisterTransactionDTO),
    ).rejects.toThrow(BadModelException);

    expect(budgetRepository.findByUserAndCategory).toHaveBeenCalledWith(
      userId,
      mockRegisterTransactionDTO.category,
    );

    expect(
      transactionRepository.findByUserAndDateRangeAndCategory,
    ).toHaveBeenCalledWith(
      mockRegisterTransactionDTO.userId,
      mockStartDate,
      mockEndDate,
      mockRegisterTransactionDTO.category,
    );

    expect(service.create).not.toHaveBeenCalled();
    expect(transactionRepository.save).not.toHaveBeenCalled();
  });
});
