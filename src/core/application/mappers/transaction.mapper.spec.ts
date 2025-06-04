import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionMapper } from './transaction.mapper';

const mockTransaction = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  datetime: new Date('2025-05-01T00:00:00Z'),
  description: 'monthly bill',
};

describe('TransactionMapper', () => {
  it('should map Transaction model to TransactionDTO', () => {
    const transactionModel = new Transaction();
    transactionModel.id = mockTransaction.id;
    transactionModel.category = mockTransaction.category;
    transactionModel.amount = mockTransaction.amount;
    transactionModel.currency = mockTransaction.currency;
    transactionModel.datetime = mockTransaction.datetime;
    transactionModel.description = mockTransaction.description;

    const transactionDTO = TransactionMapper.toDTO(transactionModel);

    expect(transactionDTO).toBeDefined();
    expect(transactionDTO.id).toEqual(transactionModel.id);
    expect(transactionDTO.category).toEqual(transactionModel.category);
    expect(transactionDTO.amount).toEqual(transactionModel.amount);
    expect(transactionDTO.currency).toEqual(transactionModel.currency);
    expect(transactionDTO.datetime).toEqual(transactionModel.datetime);
    expect(transactionDTO.description).toEqual(transactionModel.description);
  });
});
