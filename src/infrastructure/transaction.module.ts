import { Module } from '@nestjs/common';
import { CreateTransactionUseCase } from '../application/usecases/create-transaction.usecase';
import { GetTransactionByIdUseCase } from '../application/usecases/get-transaction-by-id.usecase';
import { GetTransactionsByUserUseCase } from '../application/usecases/get-transactions-by-user.usecase';
import { TransactionService } from '../domain/transaction.service';
import { TransactionHTTPAdapter } from './http/controllers/transaction.http.adapter';
import { MongoDBModule } from './mongodb/mongodb.module';

@Module({
  imports: [MongoDBModule],
  controllers: [TransactionHTTPAdapter],
  providers: [
    CreateTransactionUseCase,
    GetTransactionByIdUseCase,
    GetTransactionsByUserUseCase,
    TransactionService,
  ],
})
export class TransactionModule {}
