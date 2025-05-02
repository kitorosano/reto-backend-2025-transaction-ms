import { Injectable } from '@nestjs/common';
import { BudgetDTO } from '../../shared/dto/budget.dto';
import { RegisterTransactionDTO } from '../../shared/dto/create-transaction.dto';
import { GenerateMonthlyReportDTO } from '../../shared/dto/generate-monthly-report.dto';
import { ModifyBudgetDTO } from '../../shared/dto/modify-budget.dto';
import { MonthlyReportDTO } from '../../shared/dto/monthly-report.dto';
import { RegisterBudgetDTO } from '../../shared/dto/register-budget.dto';
import { TransactionDTO } from '../../shared/dto/transaction.dto';
import { BudgetMapper } from './mappers/budget.mapper';
import { MonthlyReportMapper } from './mappers/monthly-report.mapper';
import { TransactionMapper } from './mappers/transaction.mapper';
import { BudgetsServicePort } from './ports/inbounds/budgets.service.port';
import { MonthlyReportServicePort } from './ports/inbounds/monthly-report.service.port';
import { TransactionServicePort } from './ports/inbounds/transaction.service.port';
import { GenerateMonthlyReportUseCase } from './usecases/generate-monthly-report.usecase';
import { GetTransactionByIdUseCase } from './usecases/get-transaction-by-id.usecase';
import { GetUserBudgetsUseCase } from './usecases/get-user-budgets.usecase';
import { GetUserTransactionHistoryUseCase } from './usecases/get-user-transaction-history.usecase';
import { ModifyBudgetUseCase } from './usecases/modify-budget.usecase';
import { RegisterBudgetUseCase } from './usecases/register-budget.usecase';
import { RegisterTransactionUseCase } from './usecases/register-transaction.usecase';
import { RemoveBudgetFromUserUseCase } from './usecases/remove-budget-from-user.usecase';

@Injectable()
export class ApplicationService
  implements
    TransactionServicePort,
    MonthlyReportServicePort,
    BudgetsServicePort
{
  constructor(
    private readonly registerTransactionUseCase: RegisterTransactionUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly getUserTransactionHistoryUseCase: GetUserTransactionHistoryUseCase,
    private readonly generateMonthlyReportUseCase: GenerateMonthlyReportUseCase,
    private readonly registerBudgetUseCase: RegisterBudgetUseCase,
    private readonly getUserBudgetsUseCase: GetUserBudgetsUseCase,
    private readonly modifyBudgetUseCase: ModifyBudgetUseCase,
    private readonly removeBudgetFromUserUseCase: RemoveBudgetFromUserUseCase,
  ) {}

  async registerTransaction(
    dto: RegisterTransactionDTO,
  ): Promise<TransactionDTO> {
    const transaction = await this.registerTransactionUseCase.execute(dto);
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

  async modifyUserBudget(id: string, dto: ModifyBudgetDTO): Promise<BudgetDTO> {
    const budget = await this.modifyBudgetUseCase.execute(id, dto);
    return BudgetMapper.toDTO(budget);
  }

  async removeUserBudget(id: string, userId: string): Promise<void> {
    await this.removeBudgetFromUserUseCase.execute(id, userId);
    return;
  }
}
