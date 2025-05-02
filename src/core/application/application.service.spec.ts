import { Test, TestingModule } from '@nestjs/testing';
import { RegisterTransactionDTO } from '../../shared/dto/create-transaction.dto';
import { TransactionCurrency } from '../../shared/dto/transaction.dto';
import { ApplicationService } from './application.service';
import { TransactionRepositoryPort } from './ports/outbounds/transaction.repository.port';

describe('TransactionService', () => {
  let service: ApplicationService;
  let mockRepository: TransactionRepositoryPort; // TODO: this is for usecase, not for service

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
    } as unknown as TransactionRepositoryPort;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        { provide: TransactionRepositoryPort, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save transaction', () => {
    it('should save a transaction', async () => {
      const dto = new RegisterTransactionDTO();
      dto.category = 'Test category';
      dto.amount = 100;
      dto.currency = TransactionCurrency.USD;
      dto.datetime = new Date();
      dto.description = 'Test transaction';
      dto.userId = 'user1';

      mockRepository.save = jest.fn().mockResolvedValue(dto);

      const result = await service.registerTransaction(dto);

      expect(result).toEqual(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });
  });
});
