import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Error as MongooseError } from 'mongoose';
import { Transaction } from '../../../core/domain/models/transaction.model';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { TransactionMongoDBDocument } from '../entities/transaction.mongodb.entity';
import { TransactionMongoDBAdapter } from './transaction.mongodb.adapter';

const mockTransactionModel = {
  id: 'uuid',
  userId: 'user123',
  category: 'house',
  amount: 100,
  currency: 'USD',
  datetime: new Date('2023-10-01T12:00:00Z'),
  description: 'Monthly rent payment',
};

const mockTransactionEntity = {
  id: 'uuid',
  userId: 'user123',
  category: 'house',
  amount: 100,
  currency: 'USD',
  datetime: new Date('2023-10-01T12:00:00Z'),
  description: 'Monthly rent payment',
} as TransactionMongoDBDocument;

const mockStartDate = new Date('2023-10-01T00:00:00Z');
const mockEndDate = new Date('2023-10-31T23:59:59Z');

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindOne = jest.fn();

describe('TransactionMongoDBAdapter Entity With Constructor', () => {
  let repository: TransactionMongoDBAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionMongoDBAdapter,
        {
          provide: getModelToken('TransactionMongoDBEntity'),
          useValue: jest.fn().mockReturnValue({
            save: mockSave.mockResolvedValue(mockTransactionEntity),
          }),
        },
      ],
    }).compile();

    repository = module.get<TransactionMongoDBAdapter>(
      TransactionMongoDBAdapter,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // ==== save method ===
  it('should save a new transaction', async () => {
    const transaction = new Transaction();
    transaction.setId(mockTransactionModel.id);
    transaction.setUserId(mockTransactionModel.userId);
    transaction.setCategory(mockTransactionModel.category);
    transaction.setAmount(mockTransactionModel.amount);
    transaction.setCurrency(TransactionCurrency[mockTransactionModel.currency]);
    transaction.setDatetime(mockTransactionModel.datetime);
    transaction.setDescription(mockTransactionModel.description);

    const result = await repository.save(transaction);

    expect(result.id).toEqual(mockTransactionEntity.id);
    expect(result.userId).toEqual(mockTransactionEntity.userId);
    expect(result.category).toEqual(mockTransactionEntity.category);
    expect(result.amount).toEqual(mockTransactionEntity.amount);
    expect(result.currency).toEqual(mockTransactionEntity.currency);
    expect(result.datetime).toEqual(mockTransactionEntity.datetime);
    expect(result.description).toEqual(mockTransactionEntity.description);

    expect(mockSave).toHaveBeenCalled();
  });

  it('should throw an error if save fails', async () => {
    mockSave.mockRejectedValue(new Error('Save failed'));

    const transaction = new Transaction();
    transaction.setUserId(mockTransactionModel.userId);
    transaction.setCategory(mockTransactionModel.category);
    transaction.setAmount(mockTransactionModel.amount);
    transaction.setCurrency(TransactionCurrency[mockTransactionModel.currency]);
    transaction.setDatetime(mockTransactionModel.datetime);
    transaction.setDescription(mockTransactionModel.description);

    await expect(repository.save(transaction)).rejects.toThrow(
      UnexpectedException,
    );

    expect(mockSave).toHaveBeenCalled();
  });
});

describe('TransactionMongoDBAdapter Entity Without Constructor', () => {
  let repository: TransactionMongoDBAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionMongoDBAdapter,
        {
          provide: getModelToken('TransactionMongoDBEntity'),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: mockFindOne.mockResolvedValue(mockTransactionEntity),
            }),
            find: jest.fn().mockReturnValue({
              exec: mockFind.mockResolvedValue([mockTransactionEntity]),
            }),
          },
        },
      ],
    }).compile();

    repository = module.get<TransactionMongoDBAdapter>(
      TransactionMongoDBAdapter,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // ==== findById method ===
  it('should find a transaction by id', async () => {
    const result = await repository.findById('tests');

    expect(result?.id).toEqual(mockTransactionEntity.id);
    expect(result?.amount).toEqual(mockTransactionEntity.amount);
    expect(result?.currency).toEqual(mockTransactionEntity.currency);
    expect(result?.category).toEqual(mockTransactionEntity.category);
    expect(result?.datetime).toEqual(mockTransactionEntity.datetime);
    expect(result?.description).toEqual(mockTransactionEntity.description);
    expect(result?.userId).toEqual(mockTransactionEntity.userId);

    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should return null if transaction is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    const result = await repository.findById('not found');

    expect(result).toBeNull();
    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should throw an error if findById fails with a CastError', async () => {
    mockFindOne.mockRejectedValue(
      new MongooseError.CastError(
        'TransactionMongoDBEntity',
        'invalid-id',
        'id',
        new Error('Cast failed'),
      ),
    );

    await expect(repository.findById('invalid-id')).rejects.toThrow(
      BadModelException,
    );

    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should throw an error if findById fails', async () => {
    mockFindOne.mockRejectedValue(new Error('Find failed'));

    await expect(repository.findById('tests')).rejects.toThrow(
      UnexpectedException,
    );

    expect(mockFindOne).toHaveBeenCalled();
  });

  // ==== findByUser method ===
  it('should find a transaction by user', async () => {
    const result = await repository.findByUser('tests');

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toEqual(mockTransactionEntity.id);
    expect(result[0].amount).toEqual(mockTransactionEntity.amount);
    expect(result[0].currency).toEqual(mockTransactionEntity.currency);
    expect(result[0].category).toEqual(mockTransactionEntity.category);
    expect(result[0].datetime).toEqual(mockTransactionEntity.datetime);
    expect(result[0].description).toEqual(mockTransactionEntity.description);
    expect(result[0].userId).toEqual(mockTransactionEntity.userId);

    expect(mockFind).toHaveBeenCalled();
  });

  it('should throw an error if findByUser fails with a CastError', async () => {
    mockFind.mockRejectedValue(
      new MongooseError.CastError(
        'TransactionMongoDBEntity',
        'invalid-id',
        'id',
        new Error('Cast failed'),
      ),
    );

    await expect(repository.findByUser('invalid-id')).rejects.toThrow(
      BadModelException,
    );

    expect(mockFind).toHaveBeenCalled();
  });

  it('should throw an error if findByUser fails', async () => {
    mockFind.mockRejectedValue(new Error('Find failed'));

    await expect(repository.findByUser('tests')).rejects.toThrow(
      UnexpectedException,
    );

    expect(mockFind).toHaveBeenCalled();
  });

  // ==== findByUserAndDateRange method ===
  it('should find a transaction by user and date range', async () => {
    const result = await repository.findByUserAndDateRange(
      'tests',
      mockStartDate,
      mockEndDate,
    );

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toEqual(mockTransactionEntity.id);
    expect(result[0].amount).toEqual(mockTransactionEntity.amount);
    expect(result[0].currency).toEqual(mockTransactionEntity.currency);
    expect(result[0].category).toEqual(mockTransactionEntity.category);
    expect(result[0].datetime).toEqual(mockTransactionEntity.datetime);
    expect(result[0].description).toEqual(mockTransactionEntity.description);
    expect(result[0].userId).toEqual(mockTransactionEntity.userId);

    expect(mockFind).toHaveBeenCalled();
  });

  it('should throw an error if findByUserAndDateRange fails with a CastError', async () => {
    mockFind.mockRejectedValue(
      new MongooseError.CastError(
        'TransactionMongoDBEntity',
        'invalid-id',
        'id',
        new Error('Cast failed'),
      ),
    );

    await expect(
      repository.findByUserAndDateRange(
        'invalid-id',
        mockStartDate,
        mockEndDate,
      ),
    ).rejects.toThrow(BadModelException);

    expect(mockFind).toHaveBeenCalled();
  });

  it('should throw an error if findByUserAndDateRange fails', async () => {
    mockFind.mockRejectedValue(new Error('Find failed'));

    await expect(
      repository.findByUserAndDateRange('tests', mockStartDate, mockEndDate),
    ).rejects.toThrow(UnexpectedException);

    expect(mockFind).toHaveBeenCalled();
  });

  // ==== findByUserAndDateRangeAndCategory method ===
  it('should find a transaction by user, date range, and category', async () => {
    const result = await repository.findByUserAndDateRangeAndCategory(
      'tests',
      mockStartDate,
      mockEndDate,
      'house',
    );

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toEqual(mockTransactionEntity.id);
    expect(result[0].amount).toEqual(mockTransactionEntity.amount);
    expect(result[0].currency).toEqual(mockTransactionEntity.currency);
    expect(result[0].category).toEqual(mockTransactionEntity.category);
    expect(result[0].datetime).toEqual(mockTransactionEntity.datetime);
    expect(result[0].description).toEqual(mockTransactionEntity.description);
    expect(result[0].userId).toEqual(mockTransactionEntity.userId);

    expect(mockFind).toHaveBeenCalled();
  });

  it('should throw an error if findByUserAndDateRangeAndCategory fails with a CastError', async () => {
    mockFind.mockRejectedValue(
      new MongooseError.CastError(
        'TransactionMongoDBEntity',
        'invalid-id',
        'id',
        new Error('Cast failed'),
      ),
    );

    await expect(
      repository.findByUserAndDateRangeAndCategory(
        'invalid-id',
        mockStartDate,
        mockEndDate,
        'house',
      ),
    ).rejects.toThrow(BadModelException);

    expect(mockFind).toHaveBeenCalled();
  });

  it('should throw an error if findByUserAndDateRangeAndCategory fails', async () => {
    mockFind.mockRejectedValue(new Error('Find failed'));

    await expect(
      repository.findByUserAndDateRangeAndCategory(
        'tests',
        mockStartDate,
        mockEndDate,
        'house',
      ),
    ).rejects.toThrow(UnexpectedException);

    expect(mockFind).toHaveBeenCalled();
  });
});
