import { Injectable } from '@nestjs/common';
import { BudgetDTO } from '../../common/dto/budget.dto';
import { CreateTransactionDTO } from '../../common/dto/create-transaction.dto';
import { GenerateMonthlyReportDTO } from '../../common/dto/generate-monthly-report.dto';
import { MonthlyReportDTO } from '../../common/dto/monthly-report.dto';
import { RegisterBudgetDTO } from '../../common/dto/register-budget.dto';
import { TransactionDTO } from '../../common/dto/transaction.dto';
import { BudgetMapper } from './mappers/budget.mapper';
import { MonthlyReportMapper } from './mappers/monthly-report.mapper';
import { TransactionMapper } from './mappers/transaction.mapper';
import { BudgetsServicePort } from './ports/inbounds/budgets.service.port';
import { MonthlyReportServicePort } from './ports/inbounds/monthly-report.service.port';
import { TransactionServicePort } from './ports/inbounds/transaction.service.port';
import { CreateTransactionUseCase } from './usecases/create-transaction.usecase';
import { GenerateMonthlyReportUseCase } from './usecases/generate-monthly-report.usecase';
import { GetTransactionByIdUseCase } from './usecases/get-transaction-by-id.usecase';
import { GetUserBudgetsUseCase } from './usecases/get-user-budgets.usecase';
import { GetUserTransactionHistoryUseCase } from './usecases/get-user-transaction-history.usecase';
import { RegisterBudgetUseCase } from './usecases/register-budget.usecase';

@Injectable()
export class ApplicationService
  implements
    TransactionServicePort,
    MonthlyReportServicePort,
    BudgetsServicePort
{
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly getUserTransactionHistoryUseCase: GetUserTransactionHistoryUseCase,
    private readonly generateMonthlyReportUseCase: GenerateMonthlyReportUseCase,
    private readonly registerBudgetUseCase: RegisterBudgetUseCase,
    private readonly getUserBudgetsUseCase: GetUserBudgetsUseCase,
  ) {}

  async createTransaction(dto: CreateTransactionDTO): Promise<TransactionDTO> {
    const transaction = await this.createTransactionUseCase.execute(dto);
    return TransactionMapper.toDTO(transaction);
  }

  async getTransaction(id: string): Promise<TransactionDTO> {
    const transaction = await this.getTransactionByIdUseCase.execute(id);
    return TransactionMapper.toDTO(transaction);
  }

  async getUserTransactionHistory(userId: string): Promise<TransactionDTO[]> {
    const transactions =
      await this.getUserTransactionHistoryUseCase.execute(userId);
    return transactions.map(TransactionMapper.toDTO);
  }

  async generateMonthlyReport(
    dto: GenerateMonthlyReportDTO,
  ): Promise<MonthlyReportDTO> {
    const monthlyReport = await this.generateMonthlyReportUseCase.execute(dto);
    return MonthlyReportMapper.toDTO(monthlyReport);
  }

  async registerBudget(dto: RegisterBudgetDTO): Promise<BudgetDTO> {
    const budget = await this.registerBudgetUseCase.execute(dto);
    return BudgetMapper.toDTO(budget);
  }

  async getUserBudgets(userId: string): Promise<BudgetDTO[]> {
    const budgets = await this.getUserBudgetsUseCase.execute(userId);
    return budgets.map(BudgetMapper.toDTO);
  }
}
