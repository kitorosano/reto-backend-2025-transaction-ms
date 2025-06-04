import { Test, TestingModule } from '@nestjs/testing';
import { TransactionServicePort } from '../../../core/application/ports/inbounds/transaction.service.port';
import { AuthServicePort } from '../../../core/application/ports/outbounds/auth.service.port';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { TransactionHTTPAdapter } from './transaction.http.adapter';

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

const mockRegisterTransaction = jest.fn().mockResolvedValue(mockTransactionDTO);
const mockGetTransactionById = jest.fn().mockResolvedValue(mockTransactionDTO);
const mockGetUserTransactionHistory = jest
  .fn()
  .mockResolvedValue([mockTransactionDTO]);

describe('TransactionHTTPAdapter', () => {
  let controller: TransactionHTTPAdapter;
  let application: TransactionServicePort;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionHTTPAdapter],
      providers: [
        {
          provide: TransactionServicePort,
          useFactory: () => ({
            registerTransaction: mockRegisterTransaction,
            getTransaction: mockGetTransactionById,
            getUserTransactionHistory: mockGetUserTransactionHistory,
          }),
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: AuthServicePort,
          useFactory: () => ({
            verifyToken: jest.fn().mockResolvedValue({
              userId: mockUserId,
              email: 'email',
              name: 'name',
            }),
          }),
        },
      ],
    }).compile();

    controller = app.get<TransactionHTTPAdapter>(TransactionHTTPAdapter);
    application = app.get<TransactionServicePort>(TransactionServicePort);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(application).toBeDefined();
  });

  // ===== Transaction Tests =====
  it('should register a transaction', async () => {
    const response = await controller.registerTransaction(
      mockRegisterTransactionRequest,
      mockUserId,
    );

    expect(response).toBeDefined();
    expect(response.id).toEqual(mockTransactionResponse.id);
    expect(response.category).toEqual(mockTransactionResponse.category);
    expect(response.amount).toEqual(mockTransactionResponse.amount);
    expect(response.currency).toEqual(mockTransactionResponse.currency);
    expect(response.date).toEqual(mockTransactionResponse.datetime);
    expect(response.description).toEqual(mockTransactionResponse.description);

    expect(mockRegisterTransaction).toHaveBeenCalledWith(
      mockRegisterTransactionDTO,
    );
  });

  it('should get a transaction by ID', async () => {
    const transactionId = mockTransactionResponse.id;
    const response = await controller.getTransaction(transactionId);

    expect(response).toBeDefined();
    expect(response.id).toEqual(mockTransactionResponse.id);
    expect(response.category).toEqual(mockTransactionResponse.category);
    expect(response.amount).toEqual(mockTransactionResponse.amount);
    expect(response.currency).toEqual(mockTransactionResponse.currency);
    expect(response.date).toEqual(mockTransactionResponse.datetime);
    expect(response.description).toEqual(mockTransactionResponse.description);

    expect(mockGetTransactionById).toHaveBeenCalledWith(transactionId);
  });

  it('should get user transaction history', async () => {
    const response = await controller.getUserTransactions(mockUserId);

    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
    expect(response[0].id).toEqual(mockTransactionResponse.id);
    expect(response[0].category).toEqual(mockTransactionResponse.category);
    expect(response[0].amount).toEqual(mockTransactionResponse.amount);
    expect(response[0].currency).toEqual(mockTransactionResponse.currency);
    expect(response[0].date).toEqual(mockTransactionResponse.datetime);
    expect(response[0].description).toEqual(
      mockTransactionResponse.description,
    );

    expect(mockGetUserTransactionHistory).toHaveBeenCalledWith(mockUserId);
  });
});
