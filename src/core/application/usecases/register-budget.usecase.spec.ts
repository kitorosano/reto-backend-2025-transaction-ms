import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { BudgetService } from '../../domain/services/budget.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';
import { RegisterBudgetUseCase } from './register-budget.usecase';

const userId = 'user-123';

const mockRegisterBudgetDTO = {
  userId,
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
};

const mockBudget = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  userId,
  category: mockRegisterBudgetDTO.category,
  amount: mockRegisterBudgetDTO.amount,
  currency: mockRegisterBudgetDTO.currency,
  isActive: false,
};

const mockSave = jest.fn().mockResolvedValue(mockBudget);
const mockCreate = jest.fn().mockReturnValue(mockBudget);

describe('RegisterBudgetUseCase', () => {
  let registerBudgetUseCase: RegisterBudgetUseCase;
  let repository: BudgetRepositoryPort;
  let service: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterBudgetUseCase,
        {
          provide: BudgetRepositoryPort,
          useFactory: () => ({
            save: mockSave,
          }),
        },
        {
          provide: BudgetService,
          useFactory: () => ({
            create: mockCreate,
          }),
        },
      ],
    }).compile();

    registerBudgetUseCase = module.get<RegisterBudgetUseCase>(
      RegisterBudgetUseCase,
    );
    repository = module.get<BudgetRepositoryPort>(BudgetRepositoryPort);
    service = module.get<BudgetService>(BudgetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(registerBudgetUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should register a budget successfully', async () => {
    const result = await registerBudgetUseCase.execute(mockRegisterBudgetDTO);

    expect(result.id).toBe(mockBudget.id);
    expect(result.userId).toBe(mockBudget.userId);
    expect(result.category).toBe(mockBudget.category);
    expect(result.amount).toBe(mockBudget.amount);
    expect(result.currency).toBe(mockBudget.currency);

    expect(service.create).toHaveBeenCalledWith(mockRegisterBudgetDTO);
    expect(repository.save).toHaveBeenCalledWith(mockBudget);
  });
});
