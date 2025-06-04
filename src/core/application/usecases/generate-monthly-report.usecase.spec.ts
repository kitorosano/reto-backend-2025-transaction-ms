import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { MonthlyReportService } from '../../domain/services/monthly-report.service';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';
import { GenerateMonthlyReportUseCase } from './generate-monthly-report.usecase';

const userId = 'user-123';

const mockGenerateMonthlyReportDTO = {
  userId,
  year: 2025,
  month: 5,
};

const mockStartDate = new Date(
  mockGenerateMonthlyReportDTO.year,
  mockGenerateMonthlyReportDTO.month - 1,
  1,
);
const mockEndDate = new Date(
  mockGenerateMonthlyReportDTO.year,
  mockGenerateMonthlyReportDTO.month,
  0, // Last day of the month
);
mockEndDate.setHours(23, 59, 59, 999); // Set to the end of the day

const mockTransactionIncome = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  userId,
  category: 'house',
  amount: 100,
  currency: TransactionCurrency.USD,
  datetime: new Date('2025-05-01T00:00:00Z'),
  description: 'monthly bill',
};
const mockTransactionOutcome = {
  id: 'e7f85634-18f1-40bd-8265-430eebbfa48f',
  userId,
  category: 'house',
  amount: -50,
  currency: TransactionCurrency.USD,
  datetime: new Date('2025-05-02T00:00:00Z'),
  description: 'some expense',
};

const mockMonthlyReport = {
  id: 'f7f85634-18f1-40bd-8265-430eebbfa48g',
  userId: mockGenerateMonthlyReportDTO.userId,
  year: mockGenerateMonthlyReportDTO.year,
  month: mockGenerateMonthlyReportDTO.month,
  totalIncome: mockTransactionIncome.amount,
  totalExpense: mockTransactionOutcome.amount * -1,
  difference: mockTransactionIncome.amount + mockTransactionOutcome.amount,
  mostSpentCategory: mockTransactionIncome.category,
};

const mockMonthlyReportToCreate = {
  userId: mockGenerateMonthlyReportDTO.userId,
  year: mockGenerateMonthlyReportDTO.year,
  month: mockGenerateMonthlyReportDTO.month,
  totalIncome: mockTransactionIncome.amount,
  totalExpense: mockTransactionOutcome.amount * -1,
  categoryCount: {
    [mockTransactionIncome.category]: 1,
    [mockTransactionOutcome.category]: 1,
  },
};

const mockFindByUserAndDateRange = jest
  .fn()
  .mockResolvedValue([mockTransactionIncome, mockTransactionOutcome]);

const mockValidateUserId = jest.fn().mockReturnValue(true);
const mockCreate = jest.fn().mockReturnValue(mockMonthlyReport);

describe('GenerateMonthlyReportUseCase', () => {
  let generateMonthlyReportUseCase: GenerateMonthlyReportUseCase;
  let repository: TransactionRepositoryPort;
  let service: MonthlyReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateMonthlyReportUseCase,
        {
          provide: TransactionRepositoryPort,
          useFactory: () => ({
            findByUserAndDateRange: mockFindByUserAndDateRange,
          }),
        },
        {
          provide: MonthlyReportService,
          useFactory: () => ({
            validateUserId: mockValidateUserId,
            create: mockCreate,
          }),
        },
      ],
    }).compile();

    generateMonthlyReportUseCase = module.get<GenerateMonthlyReportUseCase>(
      GenerateMonthlyReportUseCase,
    );
    repository = module.get<TransactionRepositoryPort>(
      TransactionRepositoryPort,
    );
    service = module.get<MonthlyReportService>(MonthlyReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(generateMonthlyReportUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should generate a monthly report successfully', async () => {
    const result = await generateMonthlyReportUseCase.execute(
      mockGenerateMonthlyReportDTO,
    );

    expect(result.id).toBe(mockMonthlyReport.id);
    expect(result.userId).toBe(mockMonthlyReport.userId);
    expect(result.year).toBe(mockMonthlyReport.year);
    expect(result.month).toBe(mockMonthlyReport.month);
    expect(result.totalIncome).toBe(mockMonthlyReport.totalIncome);
    expect(result.totalExpense).toBe(mockMonthlyReport.totalExpense);
    expect(result.difference).toBe(mockMonthlyReport.difference);
    expect(result.mostSpentCategory).toBe(mockMonthlyReport.mostSpentCategory);

    expect(service.validateUserId).toHaveBeenCalledWith(userId);
    expect(repository.findByUserAndDateRange).toHaveBeenCalledWith(
      userId,
      mockStartDate,
      mockEndDate,
    );

    expect(service.create).toHaveBeenCalledWith(mockMonthlyReportToCreate);
  });

  it('should throw an error if userId is invalid', async () => {
    mockValidateUserId.mockImplementationOnce(() => {
      throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID);
    });

    await expect(
      generateMonthlyReportUseCase.execute(mockGenerateMonthlyReportDTO),
    ).rejects.toThrow(BadModelException);

    expect(service.validateUserId).toHaveBeenCalledWith(userId);
    expect(repository.findByUserAndDateRange).not.toHaveBeenCalled();
    expect(service.create).not.toHaveBeenCalled();
  });
});
