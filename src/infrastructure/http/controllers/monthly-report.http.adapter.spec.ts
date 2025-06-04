import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyReportServicePort } from '../../../core/application/ports/inbounds/monthly-report.service.port';
import { AuthServicePort } from '../../../core/application/ports/outbounds/auth.service.port';
import { AuthGuard } from '../common/guards/auth.guard';
import { MonthlyReportHTTPAdapter } from './monthly-report.http.adapter';

const mockUserId = 'user123';

const mockGenerateMonthlyReportRequest = {
  year: '2025',
  month: '5',
  userId: mockUserId,
};

const mockGenerateMonthlyReportDTO = {
  userId: mockUserId,
  year: parseInt(mockGenerateMonthlyReportRequest.year),
  month: parseInt(mockGenerateMonthlyReportRequest.month),
};

const mockMonthlyReportDTO = {
  year: 2025,
  month: 5,
  totalIncome: 100,
  totalExpense: 50,
  difference: 50,
  mostSpentCategory: 'house',
};

const mockMonthlyReportResponse = {
  year: mockMonthlyReportDTO.year,
  month: mockMonthlyReportDTO.month,
  totalIncome: mockMonthlyReportDTO.totalIncome,
  totalExpense: mockMonthlyReportDTO.totalExpense,
  difference: mockMonthlyReportDTO.difference,
  mostSpentCategory: mockMonthlyReportDTO.mostSpentCategory,
};

const mockGenerateMonthlyReport = jest
  .fn()
  .mockResolvedValue(mockMonthlyReportDTO);

describe('MonthlyReportHTTPAdapter', () => {
  let controller: MonthlyReportHTTPAdapter;
  let application: MonthlyReportServicePort;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyReportHTTPAdapter],
      providers: [
        {
          provide: MonthlyReportServicePort,
          useFactory: () => ({
            generateMonthlyReport: mockGenerateMonthlyReport,
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

    controller = app.get<MonthlyReportHTTPAdapter>(MonthlyReportHTTPAdapter);
    application = app.get<MonthlyReportServicePort>(MonthlyReportServicePort);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(application).toBeDefined();
  });

  it('should generate a monthly report', async () => {
    const response = await controller.generateMonthlyReport(
      mockGenerateMonthlyReportRequest,
      mockUserId,
    );

    expect(response).toBeDefined();
    expect(response.year).toEqual(mockMonthlyReportResponse.year);
    expect(response.month).toEqual(mockMonthlyReportResponse.month);
    expect(response.totalIncome).toEqual(mockMonthlyReportResponse.totalIncome);
    expect(response.totalExpense).toEqual(
      mockMonthlyReportResponse.totalExpense,
    );
    expect(response.difference).toEqual(mockMonthlyReportResponse.difference);
    expect(response.mostSpentCategory).toEqual(
      mockMonthlyReportResponse.mostSpentCategory,
    );

    expect(mockGenerateMonthlyReport).toHaveBeenCalledWith(
      mockGenerateMonthlyReportDTO,
    );
  });
});
