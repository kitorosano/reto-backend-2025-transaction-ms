import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { NotFoundException } from '../../../shared/errors/exceptions/not-found.exception';
import { TransactionService } from '../../domain/services/transaction.service';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';
import { GetTransactionByIdUseCase } from './get-transaction-by-id.usecase';

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

const mockFindById = jest.fn().mockResolvedValue(mockTransaction);
const mockValidateId = jest.fn().mockReturnValue(true);

describe('GetTransactionByIdUseCase', () => {
  let getTransactionByIdUseCase: GetTransactionByIdUseCase;
  let repository: TransactionRepositoryPort;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionByIdUseCase,
        {
          provide: TransactionRepositoryPort,
          useFactory: () => ({
            findById: mockFindById,
          }),
        },
        {
          provide: TransactionService,
          useFactory: () => ({
            validateId: mockValidateId,
          }),
        },
      ],
    }).compile();

    getTransactionByIdUseCase = module.get<GetTransactionByIdUseCase>(
      GetTransactionByIdUseCase,
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
    expect(getTransactionByIdUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should retrieve a transaction by ID', async () => {
    const result = await getTransactionByIdUseCase.execute(mockTransaction.id);

    expect(result.id).toBe(mockTransaction.id);
    expect(result.userId).toBe(mockTransaction.userId);
    expect(result.category).toBe(mockTransaction.category);
    expect(result.amount).toBe(mockTransaction.amount);
    expect(result.currency).toBe(mockTransaction.currency);
    expect(result.datetime).toEqual(mockTransaction.datetime);
    expect(result.description).toBe(mockTransaction.description);

    expect(service.validateId).toHaveBeenCalledWith(mockTransaction.id);
    expect(repository.findById).toHaveBeenCalledWith(mockTransaction.id);
  });

  it('should throw BadModelException if transactionId is invalid', async () => {
    mockValidateId.mockImplementationOnce(() => {
      throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID);
    });

    await expect(
      getTransactionByIdUseCase.execute(mockTransaction.id),
    ).rejects.toThrow(BadModelException);
  });

  it('should throw NotFoundException if transaction not found', async () => {
    mockFindById.mockResolvedValueOnce(null);

    await expect(
      getTransactionByIdUseCase.execute('non-existing-id'),
    ).rejects.toThrow(NotFoundException);
  });
});
