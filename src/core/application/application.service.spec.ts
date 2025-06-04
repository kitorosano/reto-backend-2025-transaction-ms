import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCurrency } from '../../shared/dto/transaction.dto';
import { ApplicationService } from './application.service';
import { GenerateMonthlyReportUseCase } from './usecases/generate-monthly-report.usecase';
import { GetTransactionByIdUseCase } from './usecases/get-transaction-by-id.usecase';
import { GetUserBudgetsUseCase } from './usecases/get-user-budgets.usecase';
import { GetUserTransactionHistoryUseCase } from './usecases/get-user-transaction-history.usecase';
import { ModifyBudgetUseCase } from './usecases/modify-budget.usecase';
import { RegisterBudgetUseCase } from './usecases/register-budget.usecase';
import { RegisterTransactionUseCase } from './usecases/register-transaction.usecase';
import { RemoveBudgetFromUserUseCase } from './usecases/remove-budget-from-user.usecase';

const userId = 'user-123';

const mockRegisterTransactionDTO = {
  userId,
  category: 'house',
  amount: 1,
  currency: TransactionCurrency.USD,
  datetime: new Date('2025-05-01T00:00:00Z'),
  description: 'monthly bill',
};

const mockTransaction = {
  id: 'd7f85634-18f1-40bd-8265-430eebbfa48e',
  category: mockRegisterTransactionDTO.category,
  amount: mockRegisterTransactionDTO.amount,
  currency: mockRegisterTransactionDTO.currency,
  datetime: mockRegisterTransactionDTO.datetime,
  description: mockRegisterTransactionDTO.description,
};

const mockGenerateMonthlyReportDTO = {
  userId,
  year: 2025,
  month: 5,
};

const mockMonthlyReport = {
  year: mockGenerateMonthlyReportDTO.year,
  month: mockGenerateMonthlyReportDTO.month,
  totalIncome: 1000,
  totalExpense: 506,
  difference: 494,
  mostSpentCategory: 'transport',
};

const mockRegisterBudgetDTO = {
  userId,
  category: 'house',
  amount: 10000,
  currency: TransactionCurrency.USD,
};

const mockBudget = {
  id: 'd4c7cc42-1fcb-4fda-807c-b1e36083a608',
  category: mockRegisterBudgetDTO.category,
  amount: mockRegisterBudgetDTO.amount,
  currency: mockRegisterBudgetDTO.currency,
  isActive: false,
};

const mockModifyBudgetDTO = {
  userId,
  category: 'transport',
  amount: 1500,
};

const mockBudgetModified = {
  id: mockBudget.id,
  category: mockModifyBudgetDTO.category,
  amount: mockModifyBudgetDTO.amount,
  currency: mockBudget.currency,
  isActive: mockBudget.isActive,
};

const mockRegisterTransaction = jest.fn().mockResolvedValue(mockTransaction);
const mockGetTransactionById = jest.fn().mockResolvedValue(mockTransaction);
const mockGetUserTransactionHistory = jest
  .fn()
  .mockResolvedValue([mockTransaction]);
const mockGenerateMonthlyReport = jest
  .fn()
  .mockResolvedValue(mockMonthlyReport);
const mockRegisterBudget = jest.fn().mockResolvedValue(mockBudget);
const mockGetUserBudgets = jest.fn().mockResolvedValue([mockBudget]);
const mockModifyBudget = jest.fn().mockResolvedValue(mockBudgetModified);
const mockRemoveBudgetFromUser = jest.fn().mockResolvedValue(undefined);

describe('TransactionService', () => {
  let service: ApplicationService;
  let registerTransactionUseCase: RegisterTransactionUseCase;
  let getTransactionByIdUseCase: GetTransactionByIdUseCase;
  let getUserTransactionHistoryUseCase: GetUserTransactionHistoryUseCase;
  let generateMonthlyReportUseCase: GenerateMonthlyReportUseCase;
  let registerBudgetUseCase: RegisterBudgetUseCase;
  let getUserBudgetsUseCase: GetUserBudgetsUseCase;
  let modifyBudgetUseCase: ModifyBudgetUseCase;
  let removeBudgetFromUserUseCase: RemoveBudgetFromUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: RegisterTransactionUseCase,
          useFactory: () => ({
            execute: mockRegisterTransaction,
          }),
        },
        {
          provide: GetTransactionByIdUseCase,
          useFactory: () => ({
            execute: mockGetTransactionById,
          }),
        },
        {
          provide: GetUserTransactionHistoryUseCase,
          useFactory: () => ({
            execute: mockGetUserTransactionHistory,
          }),
        },
        {
          provide: GenerateMonthlyReportUseCase,
          useFactory: () => ({
            execute: mockGenerateMonthlyReport,
          }),
        },
        {
          provide: RegisterBudgetUseCase,
          useFactory: () => ({
            execute: mockRegisterBudget,
          }),
        },
        {
          provide: GetUserBudgetsUseCase,
          useFactory: () => ({
            execute: mockGetUserBudgets,
          }),
        },
        {
          provide: ModifyBudgetUseCase,
          useFactory: () => ({
            execute: mockModifyBudget,
          }),
        },
        {
          provide: RemoveBudgetFromUserUseCase,
          useFactory: () => ({
            execute: mockRemoveBudgetFromUser,
          }),
        },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    registerTransactionUseCase = module.get<RegisterTransactionUseCase>(
      RegisterTransactionUseCase,
    );
    getTransactionByIdUseCase = module.get<GetTransactionByIdUseCase>(
      GetTransactionByIdUseCase,
    );
    getUserTransactionHistoryUseCase =
      module.get<GetUserTransactionHistoryUseCase>(
        GetUserTransactionHistoryUseCase,
      );
    generateMonthlyReportUseCase = module.get<GenerateMonthlyReportUseCase>(
      GenerateMonthlyReportUseCase,
    );
    registerBudgetUseCase = module.get<RegisterBudgetUseCase>(
      RegisterBudgetUseCase,
    );
    getUserBudgetsUseCase = module.get<GetUserBudgetsUseCase>(
      GetUserBudgetsUseCase,
    );
    modifyBudgetUseCase = module.get<ModifyBudgetUseCase>(ModifyBudgetUseCase);
    removeBudgetFromUserUseCase = module.get<RemoveBudgetFromUserUseCase>(
      RemoveBudgetFromUserUseCase,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(registerTransactionUseCase).toBeDefined();
    expect(getTransactionByIdUseCase).toBeDefined();
    expect(getUserTransactionHistoryUseCase).toBeDefined();
    expect(generateMonthlyReportUseCase).toBeDefined();
    expect(registerBudgetUseCase).toBeDefined();
    expect(getUserBudgetsUseCase).toBeDefined();
    expect(modifyBudgetUseCase).toBeDefined();
    expect(removeBudgetFromUserUseCase).toBeDefined();
  });

  it('should save a transaction', async () => {
    const result = await service.registerTransaction(
      mockRegisterTransactionDTO,
    );

    expect(result.id).toEqual(mockTransaction.id);
    expect(result.amount).toEqual(mockRegisterTransactionDTO.amount);
    expect(result.currency).toEqual(mockRegisterTransactionDTO.currency);
    expect(result.description).toEqual(mockRegisterTransactionDTO.description);
    expect(result.category).toEqual(mockRegisterTransactionDTO.category);
    expect(result.datetime).toEqual(mockRegisterTransactionDTO.datetime);

    expect(registerTransactionUseCase.execute).toHaveBeenCalledWith(
      mockRegisterTransactionDTO,
    );
  });

  it('should get a transaction by id', async () => {
    const result = await service.getTransaction(mockTransaction.id);

    expect(result.id).toEqual(mockTransaction.id);
    expect(result.amount).toEqual(mockTransaction.amount);
    expect(result.currency).toEqual(mockTransaction.currency);
    expect(result.description).toEqual(mockTransaction.description);
    expect(result.category).toEqual(mockTransaction.category);
    expect(result.datetime).toEqual(mockTransaction.datetime);

    expect(getTransactionByIdUseCase.execute).toHaveBeenCalledWith(
      mockTransaction.id,
    );
  });

  it('should get user transaction history', async () => {
    const result = await service.getUserTransactionHistory(userId);

    expect(result.length).toBe(1);
    expect(result[0].id).toEqual(mockTransaction.id);
    expect(result[0].amount).toEqual(mockTransaction.amount);
    expect(result[0].currency).toEqual(mockTransaction.currency);
    expect(result[0].description).toEqual(mockTransaction.description);
    expect(result[0].category).toEqual(mockTransaction.category);
    expect(result[0].datetime).toEqual(mockTransaction.datetime);

    expect(getUserTransactionHistoryUseCase.execute).toHaveBeenCalledWith(
      userId,
    );
  });

  it('should generate a monthly report', async () => {
    const result = await service.generateMonthlyReport(
      mockGenerateMonthlyReportDTO,
    );

    expect(result.year).toEqual(mockMonthlyReport.year);
    expect(result.month).toEqual(mockMonthlyReport.month);
    expect(result.totalIncome).toEqual(mockMonthlyReport.totalIncome);
    expect(result.totalExpense).toEqual(mockMonthlyReport.totalExpense);
    expect(result.difference).toEqual(mockMonthlyReport.difference);
    expect(result.mostSpentCategory).toEqual(
      mockMonthlyReport.mostSpentCategory,
    );
    expect(generateMonthlyReportUseCase.execute).toHaveBeenCalledWith(
      mockGenerateMonthlyReportDTO,
    );
  });

  it('should register a budget', async () => {
    const result = await service.registerBudget(mockRegisterBudgetDTO);

    expect(result.id).toEqual(mockBudget.id);
    expect(result.category).toEqual(mockRegisterBudgetDTO.category);
    expect(result.amount).toEqual(mockRegisterBudgetDTO.amount);
    expect(result.currency).toEqual(mockRegisterBudgetDTO.currency);
    expect(result.isActive).toEqual(mockBudget.isActive);

    expect(registerBudgetUseCase.execute).toHaveBeenCalledWith(
      mockRegisterBudgetDTO,
    );
  });

  it('should get user budgets', async () => {
    const result = await service.getUserBudgets(userId);

    expect(result.length).toBe(1);
    expect(result[0].id).toEqual(mockBudget.id);
    expect(result[0].category).toEqual(mockBudget.category);
    expect(result[0].amount).toEqual(mockBudget.amount);
    expect(result[0].currency).toEqual(mockBudget.currency);
    expect(result[0].isActive).toEqual(mockBudget.isActive);

    expect(getUserBudgetsUseCase.execute).toHaveBeenCalledWith(userId);
  });

  it('should modify a budget', async () => {
    const result = await service.modifyUserBudget(
      mockBudget.id,
      mockModifyBudgetDTO,
    );

    expect(result.id).toEqual(mockBudget.id);
    expect(result.category).toEqual(mockModifyBudgetDTO.category);
    expect(result.amount).toEqual(mockModifyBudgetDTO.amount);
    expect(result.currency).toEqual(mockBudget.currency);
    expect(result.isActive).toEqual(mockBudget.isActive);

    expect(modifyBudgetUseCase.execute).toHaveBeenCalledWith(
      mockBudget.id,
      mockModifyBudgetDTO,
    );
  });

  it('should remove a budget from user', async () => {
    await service.removeUserBudget(mockBudget.id, userId);

    expect(removeBudgetFromUserUseCase.execute).toHaveBeenCalledWith(
      mockBudget.id,
      userId,
    );
  });
});
