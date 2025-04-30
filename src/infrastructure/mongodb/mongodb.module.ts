import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionRepositoryPort } from '../../core/application/ports/outbounds/transaction.repository.port';
import {
  TransactionMongoDBEntity,
  TransactionSchema,
} from './entities/transaction.mongodb.entity';
import { TransactionMongoDBAdapter } from './repository/transaction.mongodb.adapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionMongoDBEntity.name, schema: TransactionSchema },
    ]),
  ],
  providers: [
    {
      provide: TransactionRepositoryPort,
      useClass: TransactionMongoDBAdapter,
    },
  ],
  exports: [TransactionRepositoryPort],
})
export class MongoDBModule {}
