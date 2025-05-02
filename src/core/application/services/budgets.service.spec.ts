import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';

describe('BudgetsService', () => {
  let service: BudgetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save transaction', () => {
    it('should save a transaction', async () => {});
  });
});
