import { DynamicModule, Module, Type } from '@nestjs/common';
import { TransactionHTTPAdapter } from '../infrastructure/http/controllers/transaction.http.adapter';
import { CreateTransactionUseCase } from './application/usecases/create-transaction.usecase';
import { GetTransactionByIdUseCase } from './application/usecases/get-transaction-by-id.usecase';
import { TransactionServicePort } from './application/ports/inbounds/transaction.service.port';
import { TransactionService } from './application/services/transaction.service';
import { GetUserTransactionHistoryUseCase } from './application/usecases/get-user-transaction-history.usecase';
import { TransactionFactory } from './domain/factories/transaction.factory';
import { MonthlyReportHTTPAdapter } from '../infrastructure/http/controllers/monthly-report.http.adapter';
import { MonthlyReportServicePort } from './application/ports/inbounds/monthly-report.service.port';
import { MonthlyReportService } from './application/services/monthly-reports.service';
import { GenerateMonthlyReportUseCase } from './application/usecases/generate-monthly-report.usecase';
import { MonthlyReportFactory } from './domain/factories/monthly-report.factory';

@Module({
  controllers: [TransactionHTTPAdapter, MonthlyReportHTTPAdapter],
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
    GenerateMonthlyReportUseCase
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
