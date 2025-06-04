import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { TransactionService } from '../../domain/services/transaction.service';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';
import { GetUserTransactionHistoryUseCase } from './get-user-transaction-history.usecase';

const userId = 'user-123';

const mockTransaction = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  userId,
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  datetime: new Date('2025-05-01T00:00:00Z'),
  description: 'monthly bill',
};

const mockFindByUser = jest.fn().mockResolvedValue([mockTransaction]);
const mockValidateUserId = jest.fn().mockReturnValue(true);

describe('GetUserTransactionHistoryUseCase', () => {
  let getUserTransactionHistoryUseCase: GetUserTransactionHistoryUseCase;
  let repository: TransactionRepositoryPort;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserTransactionHistoryUseCase,
        {
          provide: TransactionRepositoryPort,
          useFactory: () => ({
            findByUser: mockFindByUser,
          }),
        },
        {
          provide: TransactionService,
          useFactory: () => ({
            validateUserId: mockValidateUserId,
          }),
        },
      ],
    }).compile();

    getUserTransactionHistoryUseCase =
      module.get<GetUserTransactionHistoryUseCase>(
        GetUserTransactionHistoryUseCase,
      );
    repository = module.get<TransactionRepositoryPort>(
      TransactionRepositoryPort,
    );
    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getUserTransactionHistoryUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should retrieve user transaction history', async () => {
    const result = await getUserTransactionHistoryUseCase.execute(userId);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(mockTransaction.id);
    expect(result[0].userId).toBe(mockTransaction.userId);
    expect(result[0].category).toBe(mockTransaction.category);
    expect(result[0].amount).toBe(mockTransaction.amount);
    expect(result[0].currency).toBe(mockTransaction.currency);
    expect(result[0].datetime).toEqual(mockTransaction.datetime);
    expect(result[0].description).toBe(mockTransaction.description);

    expect(service.validateUserId).toHaveBeenCalledWith(userId);
    expect(repository.findByUser).toHaveBeenCalledWith(userId);
  });

  it('should throw BadModelException if userId is invalid', async () => {
    mockValidateUserId.mockImplementationOnce(() => {
      throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID);
    });

    await expect(
      getUserTransactionHistoryUseCase.execute(userId),
    ).rejects.toThrow(BadModelException);
  });
});
