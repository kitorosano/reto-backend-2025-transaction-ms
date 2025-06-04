import { Test, TestingModule } from '@nestjs/testing';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { MonthlyReportService } from './monthly-report.service';
import { UuidService } from './uuid.service';

const mockUserId = 'uuid';

const mockMonthlyReport = {
  userId: mockUserId,
  id: 'f7f85634-18f1-40bd-8265-430eebbfa48g',
  year: 2025,
  month: 5,
  totalIncome: 100,
  totalExpense: 50,
  difference: 50,
  mostSpentCategory: 'house',
};
const mockMonthlyReportToCreate = {
  userId: mockMonthlyReport.userId,
  year: mockMonthlyReport.year,
  month: mockMonthlyReport.month,
  totalIncome: mockMonthlyReport.totalIncome,
  totalExpense: mockMonthlyReport.totalExpense,
  categoryCount: {
    [mockMonthlyReport.mostSpentCategory]: 1,
  },
};

const mockGenerateUuid = jest.fn().mockReturnValue('uuid');
const mockValidateUuid = jest.fn().mockReturnValue(true);

describe('MonthlyReportService', () => {
  let monthlyReportService: MonthlyReportService;
  let uuidService: UuidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonthlyReportService,
        {
          provide: UuidService,
          useFactory: () => ({
            generate: mockGenerateUuid,
            validate: mockValidateUuid,
          }),
        },
      ],
    }).compile();

    monthlyReportService =
      module.get<MonthlyReportService>(MonthlyReportService);
    uuidService = module.get<UuidService>(UuidService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(monthlyReportService).toBeDefined();
    expect(uuidService).toBeDefined();
  });

  // ===== create method tests =====
  it('should generate a monthly report with valid data', async () => {
    const createdUser = monthlyReportService.create(mockMonthlyReportToCreate);

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBe('uuid');
    expect(createdUser.userId).toBe(mockUserId);
    expect(createdUser.year).toBe(mockMonthlyReport.year);
    expect(createdUser.month).toBe(mockMonthlyReport.month);
    expect(createdUser.totalIncome).toBe(mockMonthlyReport.totalIncome);
    expect(createdUser.totalExpense).toBe(mockMonthlyReport.totalExpense);
    expect(createdUser.difference).toBe(mockMonthlyReport.difference);
    expect(createdUser.mostSpentCategory).toBe(
      mockMonthlyReport.mostSpentCategory,
    );

    expect(mockGenerateUuid).toHaveBeenCalledTimes(1);
  });

  it('should throw and error if the userId is not valid', () => {
    mockValidateUuid.mockReturnValueOnce(false);

    expect(() =>
      monthlyReportService.create(mockMonthlyReportToCreate),
    ).toThrow(BadModelException);

    expect(mockValidateUuid).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw and error if the year is not valid', () => {
    // Too low number
    expect(() =>
      monthlyReportService.create({
        ...mockMonthlyReportToCreate,
        year: 1000,
      }),
    ).toThrow(BadModelException);

    // Too high number
    expect(() =>
      monthlyReportService.create({
        ...mockMonthlyReportToCreate,
        year: new Date().getFullYear() + 10,
      }),
    ).toThrow(BadModelException);
  });

  it('should throw and error if the month is not valid', () => {
    // Too low number
    expect(() =>
      monthlyReportService.create({
        ...mockMonthlyReportToCreate,
        month: 0,
      }),
    ).toThrow(BadModelException);

    // Too high number
    expect(() =>
      monthlyReportService.create({
        ...mockMonthlyReportToCreate,
        month: 13,
      }),
    ).toThrow(BadModelException);
  });

  it('should throw and error if the income or expenses are not valid number', () => {
    // Not a number
    expect(() =>
      monthlyReportService.create({
        ...mockMonthlyReportToCreate,
        totalIncome: NaN,
      }),
    ).toThrow(BadModelException);

    // Infinity
    expect(() =>
      monthlyReportService.create({
        ...mockMonthlyReportToCreate,
        totalExpense: Infinity,
      }),
    ).toThrow(BadModelException);
  });

  it('should default the most spent category if no categories are provided', () => {
    const monthlyReportWithoutCategories = {
      ...mockMonthlyReportToCreate,
      categoryCount: {},
    };

    const createdReport = monthlyReportService.create(
      monthlyReportWithoutCategories,
    );

    expect(createdReport.mostSpentCategory).toBe('');
  });

  it('should calculate the most spent category correctly', () => {
    const monthlyReportWithCategories = {
      ...mockMonthlyReportToCreate,
      categoryCount: {
        food: 2,
        house: 2,
        entertainment: 3,
        travel: 1,
      },
    };

    const createdReport = monthlyReportService.create(
      monthlyReportWithCategories,
    );

    expect(createdReport.mostSpentCategory).toBe('entertainment');
  });

  it('should throw and error if the category is too long', () => {
    const invalidMonthlyReport = {
      ...mockMonthlyReport,
      categoryCount: { ['a'.repeat(21)]: 1 },
    };

    expect(() => monthlyReportService.create(invalidMonthlyReport)).toThrow(
      BadModelException,
    );
  });

  // ===== validateId method tests =====
  it('should validate a valid UUID', () => {
    const isValid = monthlyReportService.validateId(mockUserId);

    expect(isValid).toBe(true);
    expect(mockValidateUuid).toHaveBeenCalledWith(mockUserId);
  });
  it('should throw an error for an invalid UUID', () => {
    mockValidateUuid.mockReturnValue(false);

    expect(() => monthlyReportService.validateId(mockUserId)).toThrow(
      BadModelException,
    );

    expect(mockValidateUuid).toHaveBeenCalledWith(mockUserId);
  });
});
