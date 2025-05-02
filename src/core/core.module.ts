import { DynamicModule, Module, Type } from '@nestjs/common';
import { BudgetHTTPAdapter } from '../infrastructure/http/controllers/budget.http.adapter';
import { MonthlyReportHTTPAdapter } from '../infrastructure/http/controllers/monthly-report.http.adapter';
import { TransactionHTTPAdapter } from '../infrastructure/http/controllers/transaction.http.adapter';
import { ApplicationService } from './application/application.service';
import { BudgetsServicePort } from './application/ports/inbounds/budgets.service.port';
import { MonthlyReportServicePort } from './application/ports/inbounds/monthly-report.service.port';
import { TransactionServicePort } from './application/ports/inbounds/transaction.service.port';
import { CreateTransactionUseCase } from './application/usecases/create-transaction.usecase';
import { GenerateMonthlyReportUseCase } from './application/usecases/generate-monthly-report.usecase';
import { GetTransactionByIdUseCase } from './application/usecases/get-transaction-by-id.usecase';
import { GetUserBudgetsUseCase } from './application/usecases/get-user-budgets.usecase';
import { GetUserTransactionHistoryUseCase } from './application/usecases/get-user-transaction-history.usecase';
import { RegisterBudgetUseCase } from './application/usecases/register-budget.usecase';
import { BudgetService } from './domain/services/budget.service';
import { MonthlyReportService } from './domain/services/monthly-report.service';
import { TransactionService } from './domain/services/transaction.service';
import { UuidService } from './domain/services/uuid.service';

@Module({
  controllers: [
    TransactionHTTPAdapter,
    MonthlyReportHTTPAdapter,
    BudgetHTTPAdapter,
  ],
  providers: [
    // Domain Services
    TransactionService,
    MonthlyReportService,
    BudgetService,
    UuidService,
    
    // Inbound Ports
    {
      provide: TransactionServicePort,
      useClass: ApplicationService,
    },
    {
      provide: MonthlyReportServicePort,
      useClass: ApplicationService,
    },
    {
      provide: BudgetsServicePort,
      useClass: ApplicationService,
    },

    // Use Cases
    CreateTransactionUseCase,
    GetTransactionByIdUseCase,
    GetUserTransactionHistoryUseCase,
    GenerateMonthlyReportUseCase,
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
