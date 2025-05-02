import { DynamicModule, Module, Type } from '@nestjs/common';
import { BudgetHTTPAdapter } from '../infrastructure/http/controllers/budget.http.adapter';
import { MonthlyReportHTTPAdapter } from '../infrastructure/http/controllers/monthly-report.http.adapter';
import { TransactionHTTPAdapter } from '../infrastructure/http/controllers/transaction.http.adapter';
import { BudgetsServicePort } from './application/ports/inbounds/budgets.service.port';
import { MonthlyReportServicePort } from './application/ports/inbounds/monthly-report.service.port';
import { TransactionServicePort } from './application/ports/inbounds/transaction.service.port';
import { BudgetsService } from './application/services/budgets.service';
import { MonthlyReportService } from './application/services/monthly-reports.service';
import { TransactionService } from './application/services/transaction.service';
import { CreateTransactionUseCase } from './application/usecases/create-transaction.usecase';
import { GenerateMonthlyReportUseCase } from './application/usecases/generate-monthly-report.usecase';
import { GetTransactionByIdUseCase } from './application/usecases/get-transaction-by-id.usecase';
import { GetUserTransactionHistoryUseCase } from './application/usecases/get-user-transaction-history.usecase';
import { RegisterBudgetUseCase } from './application/usecases/register-budget.usecase';
import { BudgetFactory } from './domain/factories/budget.factory';
import { MonthlyReportFactory } from './domain/factories/monthly-report.factory';
import { TransactionFactory } from './domain/factories/transaction.factory';
import { GetUserBudgetsUseCase } from './application/usecases/get-user-budgets.usecase';

@Module({
  controllers: [
    TransactionHTTPAdapter,
    MonthlyReportHTTPAdapter,
    BudgetHTTPAdapter,
  ],
  providers: [
    // Transaction
    {
      provide: TransactionServicePort,
      useClass: TransactionService,
    },
    TransactionFactory,
    CreateTransactionUseCase,
    GetTransactionByIdUseCase,
    GetUserTransactionHistoryUseCase,

    // Monthly Report
    {
      provide: MonthlyReportServicePort,
      useClass: MonthlyReportService,
    },
    MonthlyReportFactory,
    GenerateMonthlyReportUseCase,

    // Budget
    {
      provide: BudgetsServicePort,
      useClass: BudgetsService,
    },
    BudgetFactory,
    RegisterBudgetUseCase,
    GetUserBudgetsUseCase,
  ],
})
export class CoreModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: CoreModule,
      imports: [infrastructureModule],
    };
  }
}
