import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetRepositoryPort } from '../../core/application/ports/outbounds/budget.repository.port';
import { TransactionRepositoryPort } from '../../core/application/ports/outbounds/transaction.repository.port';
import {
  TransactionMongoDBEntity,
  TransactionSchema,
} from './entities/transaction.mongodb.entity';
import { BudgetMongoDBAdapter } from './repository/budget.mongodb.adapter';
import { TransactionMongoDBAdapter } from './repository/transaction.mongodb.adapter';
import { BudgetMongoDBEntity, BudgetSchema } from './entities/budget.mongodb.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionMongoDBEntity.name, schema: TransactionSchema },
      { name: BudgetMongoDBEntity.name, schema: BudgetSchema },
    ]),
  ],
  providers: [
    // Outbound Ports
    {
      provide: TransactionRepositoryPort,
      useClass: TransactionMongoDBAdapter,
    },
    {
      provide: BudgetRepositoryPort,
      useClass: BudgetMongoDBAdapter,
    },
  ],
  exports: [TransactionRepositoryPort, BudgetRepositoryPort],
})
export class MongoDBModule {}
