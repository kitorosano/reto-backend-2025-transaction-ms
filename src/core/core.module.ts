import { DynamicModule, Module, Type } from '@nestjs/common';
import { TransactionHTTPAdapter } from 'src/infrastructure/http/controllers/transaction.http.adapter';
import { CreateTransactionUseCase } from '../core/application/usecases/create-transaction.usecase';
import { GetTransactionByIdUseCase } from '../core/application/usecases/get-transaction-by-id.usecase';
import { TransactionServicePort } from './application/ports/inbounds/transaction.service.port';
import { TransactionService } from './application/transaction.service';
import { GetUserTransactionHistoryUseCase } from './application/usecases/get-user-transaction-history.usecase';
import { TransactionFactory } from './domain/factories/transaction.factory';

@Module({
  controllers: [TransactionHTTPAdapter],
  providers: [
    {
      provide: TransactionServicePort,
      useClass: TransactionService,
    },
    TransactionFactory,
    CreateTransactionUseCase,
    GetTransactionByIdUseCase,
    GetUserTransactionHistoryUseCase,
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
