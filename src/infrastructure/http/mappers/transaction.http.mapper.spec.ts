import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { TransactionHTTPMapper } from './transaction.http.mapper';

const mockUserId = 'user123';

const mockRegisterTransactionRequest = {
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  datetime: '2025-05-02T00:48:00.000',
  description: 'monthly bill',
};

const mockRegisterTransactionDTO = {
  userId: mockUserId,
  category: mockRegisterTransactionRequest.category,
  amount: mockRegisterTransactionRequest.amount,
  currency: mockRegisterTransactionRequest.currency,
  datetime: new Date(mockRegisterTransactionRequest.datetime),
  description: mockRegisterTransactionRequest.description,
};

const mockTransactionDTO = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  userId: mockUserId,
  category: mockRegisterTransactionRequest.category,
  amount: mockRegisterTransactionRequest.amount,
  currency: TransactionCurrency[mockRegisterTransactionRequest.currency],
  datetime: new Date(mockRegisterTransactionRequest.datetime),
  description: mockRegisterTransactionRequest.description,
};

const mockTransactionResponse = {
  id: mockTransactionDTO.id,
  userId: mockUserId,
  category: mockTransactionDTO.category,
  amount: mockTransactionDTO.amount,
  currency: mockTransactionDTO.currency,
  datetime: mockTransactionDTO.datetime,
  description: mockTransactionDTO.description,
};

describe('TransactionHTTPMapper', () => {
  it('should map RegisterTransactionHTTPRequest to RegisterTransactionDTO', () => {
    const dto = TransactionHTTPMapper.toDTO(
      mockRegisterTransactionRequest,
      mockUserId,
    );

    expect(dto).toBeDefined();
    expect(dto.category).toEqual(mockRegisterTransactionDTO.category);
    expect(dto.amount).toEqual(mockRegisterTransactionDTO.amount);
    expect(dto.currency).toEqual(mockRegisterTransactionDTO.currency);
    expect(dto.datetime).toEqual(new Date(mockRegisterTransactionDTO.datetime));
    expect(dto.description).toEqual(mockRegisterTransactionDTO.description);
    expect(dto.userId).toEqual(mockRegisterTransactionDTO.userId);
  });

  it('should map TransactionDTO to TransactionHTTPResponse', () => {
    const response = TransactionHTTPMapper.toResponse(mockTransactionDTO);

    expect(response).toBeDefined();
    expect(response.id).toEqual(mockTransactionResponse.id);
    expect(response.category).toEqual(mockTransactionResponse.category);
    expect(response.amount).toEqual(mockTransactionResponse.amount);
    expect(response.currency).toEqual(
      TransactionCurrency[mockTransactionResponse.currency],
    );
    expect(response.date).toEqual(mockTransactionResponse.datetime);
    expect(response.description).toEqual(mockTransactionResponse.description);
  });
});
