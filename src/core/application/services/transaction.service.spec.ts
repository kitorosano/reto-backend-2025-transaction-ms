import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';
import { CreateTransactionDTO } from '../../../common/dto/create-transaction.dto';
import { TransactionCurrency } from '../../../common/dto/transaction.dto';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let mockRepository: TransactionRepositoryPort; // TODO: this is for usecase, not for service

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
    } as unknown as TransactionRepositoryPort;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: TransactionRepositoryPort, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save transaction', () => {
    it('should save a transaction', async () => {
      const dto = new CreateTransactionDTO();
      dto.category = 'Test category';
      dto.amount = 100;
      dto.currency = TransactionCurrency.USD;
      dto.datetime = new Date();
      dto.description = 'Test transaction';
      dto.userId = 'user1';

      mockRepository.save = jest.fn().mockResolvedValue(dto);

      const result = await service.createTransaction(dto);

      expect(result).toEqual(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });
  });
});
