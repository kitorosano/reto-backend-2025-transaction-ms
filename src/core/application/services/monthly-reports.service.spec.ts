import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyReportService } from './monthly-reports.service';

describe('MonthlyReportService', () => {
  let service: MonthlyReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    service = module.get<MonthlyReportService>(MonthlyReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save transaction', () => {
    it('should save a transaction', async () => {});
  });
});
