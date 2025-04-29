import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import environment from 'src/config/environment';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import {
  TransactionMongoDBEntity,
  TransactionSchema,
} from './entities/transaction.mongodb.entity';
import { TransactionMongoDBAdapter } from './repository/transaction.mongodb.adapter';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongoUri),
    MongooseModule.forFeature([
      { name: TransactionMongoDBEntity.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: TransactionRepositoryPort,
      useClass: TransactionMongoDBAdapter,
    },
  ],
  exports: [TransactionRepositoryPort],
})
export class MongoDBModule {}
