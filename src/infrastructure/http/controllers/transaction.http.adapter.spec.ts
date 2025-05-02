import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionByIdUseCase } from '../../../core/application/usecases/get-transaction-by-id.usecase';
import { GetUserTransactionHistoryUseCase } from '../../../core/application/usecases/get-user-transaction-history.usecase';
import { RegisterTransactionUseCase } from '../../../core/application/usecases/register-transaction.usecase';
import { TransactionHTTPAdapter } from './transaction.http.adapter';

describe('TransactionHTTPAdapter', () => {
  let controller: TransactionHTTPAdapter;
  let mockRegisterTransactionUseCase: RegisterTransactionUseCase;
  let mockGetUserTransactionHistoryUseCase: GetUserTransactionHistoryUseCase;
  let mockGetTransactionByIdUseCase: GetTransactionByIdUseCase;

  beforeEach(async () => {
    mockRegisterTransactionUseCase = {
      execute: jest.fn(),
    } as unknown as RegisterTransactionUseCase;

    mockGetUserTransactionHistoryUseCase = {
      execute: jest.fn(),
    } as unknown as GetUserTransactionHistoryUseCase;

    mockGetTransactionByIdUseCase = {
      execute: jest.fn(),
    } as unknown as GetTransactionByIdUseCase;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionHTTPAdapter],
      providers: [
        {
          provide: RegisterTransactionUseCase,
          useValue: mockRegisterTransactionUseCase,
        },
        {
          provide: GetUserTransactionHistoryUseCase,
          useValue: mockGetUserTransactionHistoryUseCase,
        },
        {
          provide: GetTransactionByIdUseCase,
          useValue: mockGetTransactionByIdUseCase,
        },
      ],
    }).compile();

    controller = app.get<TransactionHTTPAdapter>(TransactionHTTPAdapter);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create transaction usecase', () => {});

  describe('get transaction by id usecase', () => {});

  describe('get user transaction history usecase', () => {});
});
