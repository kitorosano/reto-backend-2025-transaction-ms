import { TransactionMongoDBDocument } from '../entities/transaction.mongodb.entity';
import { TransactionMongoDBMapper } from './transaction.mongodb.mapper';

const mockTransactionDocument = {
  id: 'uuid',
  userId: 'user123',
  category: 'house',
  amount: 100,
  currency: 'USD',
  datetime: new Date('2023-10-01T12:00:00Z'),
  description: 'Monthly rent payment',
} as TransactionMongoDBDocument;

const mockTransactionResponse = {
  id: mockTransactionDocument.id,
  userId: mockTransactionDocument.userId,
  category: mockTransactionDocument.category,
  amount: mockTransactionDocument.amount,
  currency: mockTransactionDocument.currency,
  datetime: mockTransactionDocument.datetime,
  description: mockTransactionDocument.description,
};

describe('TransactionMongoDBMapper', () => {
  it('should map TransactionMongoDBDocument to Transaction', () => {
    const model = TransactionMongoDBMapper.toModel(mockTransactionDocument);

    expect(model).toBeDefined();
    expect(model.id).toEqual(mockTransactionResponse.id);
    expect(model.userId).toEqual(mockTransactionResponse.userId);
    expect(model.category).toEqual(mockTransactionResponse.category);
    expect(model.amount).toEqual(mockTransactionResponse.amount);
    expect(model.currency).toEqual(mockTransactionResponse.currency);
    expect(model.datetime).toEqual(mockTransactionResponse.datetime);
    expect(model.description).toEqual(mockTransactionResponse.description);
  });
});
