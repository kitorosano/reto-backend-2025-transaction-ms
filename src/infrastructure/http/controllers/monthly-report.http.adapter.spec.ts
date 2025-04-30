import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyReportHTTPAdapter } from './monthly-report.http.adapter';
import { GenerateMonthlyReportUseCase } from '../../../core/application/usecases/generate-monthly-report.usecase';

describe('MonthlyReportHTTPAdapter', () => {
  let controller: MonthlyReportHTTPAdapter;
  let mockGenerateMonthlyReportUseCase: GenerateMonthlyReportUseCase;

  beforeEach(async () => {
    mockGenerateMonthlyReportUseCase = {
      execute: jest.fn(),
    } as unknown as GenerateMonthlyReportUseCase;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyReportHTTPAdapter],
      providers: [
        {
          provide: GenerateMonthlyReportUseCase,
          useValue: mockGenerateMonthlyReportUseCase,
        },
      ],
    }).compile();

    controller = app.get<MonthlyReportHTTPAdapter>(MonthlyReportHTTPAdapter);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generate monthly report usecase', () => {});
});
