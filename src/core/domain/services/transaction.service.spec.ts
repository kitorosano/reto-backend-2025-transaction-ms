import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { TransactionService } from './transaction.service';
import { UuidService } from './uuid.service';

const mockUserId = 'uuid';

const mockTransaction = {
  userId: mockUserId,
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  datetime: new Date('2025-05-01T00:00:00Z'),
  description: 'monthly bill',
};

const mockGenerateUuid = jest.fn().mockReturnValue('uuid');
const mockValidateUuid = jest.fn().mockReturnValue(true);

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let uuidService: UuidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: UuidService,
          useFactory: () => ({
            generate: mockGenerateUuid,
            validate: mockValidateUuid,
          }),
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    uuidService = module.get<UuidService>(UuidService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
    expect(uuidService).toBeDefined();
  });

  // ===== create method tests =====
  it('should create a transaction with valid data', async () => {
    const createdUser = transactionService.create(mockTransaction);

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBe('uuid');
    expect(createdUser.userId).toBe(mockUserId);
    expect(createdUser.category).toBe(mockTransaction.category);
    expect(createdUser.amount).toBe(mockTransaction.amount);
    expect(createdUser.currency).toBe(mockTransaction.currency);
    expect(createdUser.datetime).toEqual(mockTransaction.datetime);
    expect(createdUser.description).toBe(mockTransaction.description);

    expect(mockGenerateUuid).toHaveBeenCalledTimes(1);
  });

  it('should throw and error if the userId is not valid', () => {
    mockValidateUuid.mockReturnValueOnce(false);

    expect(() => transactionService.create(mockTransaction)).toThrow(
      BadModelException,
    );

    expect(mockValidateUuid).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw and error if the datetime is not valid', () => {
    const invalidTransaction = {
      ...mockTransaction,
      datetime: new Date('nothing'),
    };

    expect(() => transactionService.create(invalidTransaction)).toThrow(
      BadModelException,
    );
  });

  it('should throw and error if the amount is not valid number', () => {
    // Not a number
    expect(() =>
      transactionService.create({
        ...mockTransaction,
        amount: NaN,
      }),
    ).toThrow(BadModelException);

    //  Too low number
    expect(() =>
      transactionService.create({
        ...mockTransaction,
        amount: -0.00001,
      }),
    ).toThrow(BadModelException);

    // Too high number
    expect(() =>
      transactionService.create({
        ...mockTransaction,
        amount: 1_000_001,
      }),
    ).toThrow(BadModelException);

    // Infinity
    expect(() =>
      transactionService.create({
        ...mockTransaction,
        amount: Infinity,
      }),
    ).toThrow(BadModelException);
  });

  it('should throw and error if the currency is not valid', () => {
    const invalidTransaction = {
      ...mockTransaction,
      currency: 'invalid' as TransactionCurrency,
    };

    expect(() => transactionService.create(invalidTransaction)).toThrow(
      BadModelException,
    );
  });

  it('should set default category if category is empty string', () => {
    const invalidTransaction = {
      ...mockTransaction,
      category: '',
    };
    const createdTransaction = transactionService.create(invalidTransaction);

    expect(createdTransaction.category).toBe('uncategorized');
  });

  it('should throw and error if the category is too long', () => {
    const invalidTransaction = {
      ...mockTransaction,
      category: 'a'.repeat(21), // 21 characters
    };

    expect(() => transactionService.create(invalidTransaction)).toThrow(
      BadModelException,
    );
  });

  it('should set default description if description is empty string', () => {
    const invalidTransaction = {
      ...mockTransaction,
      description: '',
    };
    const createdTransaction = transactionService.create(invalidTransaction);

    expect(createdTransaction.description).toBe('');
  });

  it('should throw and error if the description is too long', () => {
    const invalidTransaction = {
      ...mockTransaction,
      description: 'a'.repeat(51), // 51 characters
    };

    expect(() => transactionService.create(invalidTransaction)).toThrow(
      BadModelException,
    );
  });

  // ===== validateId method tests =====
  it('should validate a valid UUID', () => {
    const isValid = transactionService.validateId(mockUserId);

    expect(isValid).toBe(true);
    expect(mockValidateUuid).toHaveBeenCalledWith(mockUserId);
  });
  it('should throw an error for an invalid UUID', () => {
    mockValidateUuid.mockReturnValue(false);

    expect(() => transactionService.validateId(mockUserId)).toThrow(
      BadModelException,
    );

    expect(mockValidateUuid).toHaveBeenCalledWith(mockUserId);
  });
});
