import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../../../domain/models/transaction.model';
import { TransactionRepositoryPort } from '../../../domain/ports/transaction.repository.port';
import {
  TransactionMongoDBDocument,
  TransactionMongoDBEntity,
} from '../entities/transaction.mongodb.entity';
import { TransactionMongoDBMapper } from '../mappers/transaction.mongodb.mapper';

export class TransactionMongoDBAdapter implements TransactionRepositoryPort {
  constructor(
    @InjectModel(TransactionMongoDBEntity.name)
    private readonly transactionEntity: Model<TransactionMongoDBDocument>,
  ) {}

  async save(transaction: Transaction): Promise<Transaction> {
    const entity = new this.transactionEntity(transaction);
    const savedEntity = await entity.save();

    return TransactionMongoDBMapper.toModel(savedEntity);
  }

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.transactionEntity.findById(id).exec();

    if (!entity) return null;

    return TransactionMongoDBMapper.toModel(entity);
  }

  async findByUser(userId: string): Promise<Transaction[]> {
    const entities = await this.transactionEntity
      .find({ userId }, null, { sort: { date: -1 } })
      .exec();

    return entities.map((entity) => TransactionMongoDBMapper.toModel(entity));
  }
}
