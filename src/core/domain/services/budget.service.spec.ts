import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { BudgetService } from './budget.service';
import { UuidService } from './uuid.service';

const mockUserId = 'uuid';

const mockBudget = {
  userId: mockUserId,
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  isActive: false,
};

const mockGenerateUuid = jest.fn().mockReturnValue('uuid');
const mockValidateUuid = jest.fn().mockReturnValue(true);

describe('BudgetService', () => {
  let budgetService: BudgetService;
  let uuidService: UuidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        {
          provide: UuidService,
          useFactory: () => ({
            generate: mockGenerateUuid,
            validate: mockValidateUuid,
          }),
        },
      ],
    }).compile();

    budgetService = module.get<BudgetService>(BudgetService);
    uuidService = module.get<UuidService>(UuidService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(budgetService).toBeDefined();
    expect(uuidService).toBeDefined();
  });

  // ===== create method tests =====
  it('should create a budget with valid data', async () => {
    const createdUser = budgetService.create(mockBudget);

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBe('uuid');
    expect(createdUser.userId).toBe(mockUserId);
    expect(createdUser.category).toBe(mockBudget.category);
    expect(createdUser.amount).toBe(mockBudget.amount);
    expect(createdUser.currency).toBe(mockBudget.currency);
    expect(createdUser.isActive).toBe(mockBudget.isActive);

    expect(mockGenerateUuid).toHaveBeenCalledTimes(1);
  });

  it('should throw and error if the userId is not valid', () => {
    mockValidateUuid.mockReturnValueOnce(false);

    expect(() => budgetService.create(mockBudget)).toThrow(BadModelException);

    expect(mockValidateUuid).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw and error if the amount is not valid number', () => {
    // Not a number
    expect(() =>
      budgetService.create({
        ...mockBudget,
        amount: NaN,
      }),
    ).toThrow(BadModelException);

    //  Too low number
    expect(() =>
      budgetService.create({
        ...mockBudget,
        amount: -0.00001,
      }),
    ).toThrow(BadModelException);

    // Too high number
    expect(() =>
      budgetService.create({
        ...mockBudget,
        amount: 1_000_001,
      }),
    ).toThrow(BadModelException);

    // Infinity
    expect(() =>
      budgetService.create({
        ...mockBudget,
        amount: Infinity,
      }),
    ).toThrow(BadModelException);
  });

  it('should throw and error if the currency is not valid', () => {
    const invalidBudget = {
      ...mockBudget,
      currency: 'invalid' as TransactionCurrency,
    };

    expect(() => budgetService.create(invalidBudget)).toThrow(
      BadModelException,
    );
  });

  it('should throw and error if the category is too long', () => {
    const invalidBudget = {
      ...mockBudget,
      category: 'a'.repeat(21), // 21 characters
    };

    expect(() => budgetService.create(invalidBudget)).toThrow(
      BadModelException,
    );
  });

  // ===== modify method tests =====
  it('should modify a budget with valid data', () => {
    const modifiedBudget = budgetService.modify({
      ...mockBudget,
      id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
      isActive: true,
    });

    expect(modifiedBudget).toBeDefined();
    expect(modifiedBudget.id).toBe('d7f85634-18f1-40bd-8265-430eebbfa48e');
    expect(modifiedBudget.userId).toBe(mockUserId);
    expect(modifiedBudget.category).toBe(mockBudget.category);
    expect(modifiedBudget.amount).toBe(mockBudget.amount);
    expect(modifiedBudget.currency).toBe(mockBudget.currency);
    expect(modifiedBudget.isActive).toBe(true);
  });

  // ===== validateId method tests =====
  it('should validate a valid UUID', () => {
    const isValid = budgetService.validateId(mockUserId);

    expect(isValid).toBe(true);
    expect(mockValidateUuid).toHaveBeenCalledWith(mockUserId);
  });
  it('should throw an error for an invalid UUID', () => {
    mockValidateUuid.mockReturnValue(false);

    expect(() => budgetService.validateId(mockUserId)).toThrow(
      BadModelException,
    );

    expect(mockValidateUuid).toHaveBeenCalledWith(mockUserId);
  });
});
