import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Error as MongooseError } from 'mongoose';
import { Budget } from '../../../core/domain/models/budget.model';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { BudgetMongoDBDocument } from '../entities/budget.mongodb.entity';
import { BudgetMongoDBAdapter } from './budget.mongodb.adapter';

const mockBudgetModel = {
  id: 'uuid',
  userId: 'user123',
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  isActive: true,
};

const mockBudgetEntity = {
  id: 'uuid',
  userId: 'user123',
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  isActive: true,
} as BudgetMongoDBDocument;

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockFindOneAndDelete = jest.fn();

describe('BudgetMongoDBAdapter Entity With Constructor', () => {
  let repository: BudgetMongoDBAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetMongoDBAdapter,
        {
          provide: getModelToken('BudgetMongoDBEntity'),
          useValue: jest.fn().mockReturnValue({
            save: mockSave.mockResolvedValue(mockBudgetEntity),
          }),
        },
      ],
    }).compile();

    repository = module.get<BudgetMongoDBAdapter>(BudgetMongoDBAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // ==== save method ===
  it('should save a new budget', async () => {
    const budget = new Budget();
    budget.setId(mockBudgetModel.id);
    budget.setUserId(mockBudgetModel.userId);
    budget.setCategory(mockBudgetModel.category);
    budget.setAmount(mockBudgetModel.amount);
    budget.setCurrency(mockBudgetModel.currency);
    budget.setIsActive(mockBudgetModel.isActive);

    const result = await repository.save(budget);

    expect(result.id).toEqual(mockBudgetEntity.id);
    expect(result.userId).toEqual(mockBudgetEntity.userId);
    expect(result.category).toEqual(mockBudgetEntity.category);
    expect(result.amount).toEqual(mockBudgetEntity.amount);
    expect(result.currency).toEqual(mockBudgetEntity.currency);
    expect(result.isActive).toEqual(mockBudgetEntity.isActive);

    expect(mockSave).toHaveBeenCalled();
  });

  it('should throw an error if save fails', async () => {
    mockSave.mockRejectedValue(new Error('Save failed'));

    const budget = new Budget();
    budget.setUserId(mockBudgetModel.userId);
    budget.setCategory(mockBudgetModel.category);
    budget.setAmount(mockBudgetModel.amount);
    budget.setCurrency(mockBudgetModel.currency);
    budget.setIsActive(mockBudgetModel.isActive);

    await expect(repository.save(budget)).rejects.toThrow(UnexpectedException);

    expect(mockSave).toHaveBeenCalled();
  });
});

describe('BudgetMongoDBAdapter Entity Without Constructor', () => {
  let repository: BudgetMongoDBAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetMongoDBAdapter,
        {
          provide: getModelToken('BudgetMongoDBEntity'),
          useValue: {
            find: jest.fn().mockReturnValue({
              exec: mockFind.mockResolvedValue([mockBudgetEntity]),
            }),
            findOne: jest.fn().mockReturnValue({
              exec: mockFindOne.mockResolvedValue(mockBudgetEntity),
            }),
            findOneAndUpdate: jest.fn().mockReturnValue({
              exec: mockFindOneAndUpdate.mockResolvedValue(mockBudgetEntity),
            }),
            findOneAndDelete: jest.fn().mockReturnValue({
              exec: mockFindOneAndDelete.mockResolvedValue(mockBudgetEntity),
            }),
          },
        },
      ],
    }).compile();

    repository = module.get<BudgetMongoDBAdapter>(BudgetMongoDBAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // ==== findByUser method ===
  it('should find a budget by user', async () => {
    const result = await repository.findByUser('tests');

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toEqual(mockBudgetEntity.id);
    expect(result[0].amount).toEqual(mockBudgetEntity.amount);
    expect(result[0].currency).toEqual(mockBudgetEntity.currency);
    expect(result[0].category).toEqual(mockBudgetEntity.category);
    expect(result[0].isActive).toEqual(mockBudgetEntity.isActive);
    expect(result[0].userId).toEqual(mockBudgetEntity.userId);

    expect(mockFind).toHaveBeenCalled();
  });

  it('should throw an error if findByUser fails with a CastError', async () => {
    mockFind.mockRejectedValue(
      new MongooseError.CastError(
        'BudgetMongoDBEntity',
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

  // ==== findByUserAndCategory method ===
  it('should find a budget by user and category', async () => {
    const result = await repository.findByUserAndCategory(
      'tests',
      mockBudgetEntity.category,
    );

    expect(result).toBeDefined();
    expect(result?.id).toEqual(mockBudgetEntity.id);
    expect(result?.amount).toEqual(mockBudgetEntity.amount);
    expect(result?.currency).toEqual(mockBudgetEntity.currency);
    expect(result?.category).toEqual(mockBudgetEntity.category);
    expect(result?.isActive).toEqual(mockBudgetEntity.isActive);
    expect(result?.userId).toEqual(mockBudgetEntity.userId);

    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should throw an error if findByUserAndCategory fails with a CastError', async () => {
    mockFindOne.mockRejectedValue(
      new MongooseError.CastError(
        'BudgetMongoDBEntity',
        'invalid-id',
        'id',
        new Error('Cast failed'),
      ),
    );

    await expect(
      repository.findByUserAndCategory('invalid-id', mockBudgetEntity.category),
    ).rejects.toThrow(BadModelException);

    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should throw an error if findByUserAndCategory fails', async () => {
    mockFindOne.mockRejectedValue(new Error('Find failed'));

    await expect(
      repository.findByUserAndCategory('tests', mockBudgetEntity.category),
    ).rejects.toThrow(UnexpectedException);

    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should return null if budget does not exist', async () => {
    mockFindOne.mockResolvedValue(null);

    const result = await repository.findByUserAndCategory(
      'tests',
      mockBudgetEntity.category,
    );

    expect(result).toBeNull();
    expect(mockFindOne).toHaveBeenCalled();
  });

  // ==== update method ===
  it('should update a budget', async () => {
    const budget = new Budget();
    budget.setId(mockBudgetModel.id);
    budget.setUserId(mockBudgetModel.userId);
    budget.setCategory(mockBudgetModel.category);
    budget.setAmount(mockBudgetModel.amount);
    budget.setCurrency(mockBudgetModel.currency);
    budget.setIsActive(mockBudgetModel.isActive);

    const result = await repository.update(budget);

    expect(result).toBeDefined();
    expect(result?.id).toEqual(mockBudgetEntity.id);
    expect(result?.userId).toEqual(mockBudgetEntity.userId);
    expect(result?.category).toEqual(mockBudgetEntity.category);
    expect(result?.amount).toEqual(mockBudgetEntity.amount);
    expect(result?.currency).toEqual(mockBudgetEntity.currency);
    expect(result?.isActive).toEqual(mockBudgetEntity.isActive);

    expect(mockFindOneAndUpdate).toHaveBeenCalled();
  });

  it('should throw an error if update fails', async () => {
    mockFindOneAndUpdate.mockRejectedValue(new Error('Update failed'));

    const budget = new Budget();
    budget.setId(mockBudgetModel.id);
    budget.setUserId(mockBudgetModel.userId);
    budget.setCategory(mockBudgetModel.category);
    budget.setAmount(mockBudgetModel.amount);
    budget.setCurrency(mockBudgetModel.currency);
    budget.setIsActive(mockBudgetModel.isActive);

    await expect(repository.update(budget)).rejects.toThrow(
      UnexpectedException,
    );

    expect(mockFindOneAndUpdate).toHaveBeenCalled();
  });

  it('should return null if budget to update does not exist', async () => {
    mockFindOneAndUpdate.mockResolvedValue(null);

    const budget = new Budget();
    budget.setId(mockBudgetModel.id);
    budget.setUserId(mockBudgetModel.userId);
    budget.setCategory(mockBudgetModel.category);
    budget.setAmount(mockBudgetModel.amount);
    budget.setCurrency(mockBudgetModel.currency);
    budget.setIsActive(mockBudgetModel.isActive);

    const result = await repository.update(budget);

    expect(result).toBeNull();
    expect(mockFindOneAndUpdate).toHaveBeenCalled();
  });

  // ==== delete method ===
  it('should delete a budget', async () => {
    const result = await repository.delete(
      mockBudgetModel.id,
      mockBudgetModel.userId,
    );

    expect(result).toBeDefined();
    expect(result?.id).toEqual(mockBudgetEntity.id);
    expect(result?.userId).toEqual(mockBudgetEntity.userId);
    expect(result?.category).toEqual(mockBudgetEntity.category);
    expect(result?.amount).toEqual(mockBudgetEntity.amount);
    expect(result?.currency).toEqual(mockBudgetEntity.currency);
    expect(result?.isActive).toEqual(mockBudgetEntity.isActive);

    expect(mockFindOneAndDelete).toHaveBeenCalled();
  });

  it('should throw an error if delete fails with a CastError', async () => {
    mockFindOneAndDelete.mockRejectedValue(
      new MongooseError.CastError(
        'BudgetMongoDBEntity',
        'invalid-id',
        'id',
        new Error('Cast failed'),
      ),
    );

    await expect(
      repository.delete('invalid-id', mockBudgetModel.userId),
    ).rejects.toThrow(BadModelException);

    expect(mockFindOneAndDelete).toHaveBeenCalled();
  });

  it('should throw an error if delete fails', async () => {
    mockFindOneAndDelete.mockRejectedValue(new Error('Delete failed'));

    await expect(
      repository.delete(mockBudgetModel.id, mockBudgetModel.userId),
    ).rejects.toThrow(UnexpectedException);

    expect(mockFindOneAndDelete).toHaveBeenCalled();
  });

  it('should return null if budget to delete does not exist', async () => {
    mockFindOneAndDelete.mockResolvedValue(null);

    const result = await repository.delete(
      mockBudgetModel.id,
      mockBudgetModel.userId,
    );

    expect(result).toBeNull();
    expect(mockFindOneAndDelete).toHaveBeenCalled();
  });
});
