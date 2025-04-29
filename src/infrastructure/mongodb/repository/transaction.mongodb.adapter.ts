import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { Transaction } from '../../../domain/models/transaction.model';
import { TransactionRepositoryPort } from '../../../domain/ports/transaction.repository.port';
import {
  TransactionMongoDBDocument,
  TransactionMongoDBEntity,
} from '../entities/transaction.mongodb.entity';
import { InvalidIdCustomException } from '../exceptions/invalid-id.exception';
import { MongoDBAdapterCustomException } from '../exceptions/mongodb-adapter.exception';
import { TransactionMongoDBMapper } from '../mappers/transaction.mongodb.mapper';

export class TransactionMongoDBAdapter implements TransactionRepositoryPort {
  constructor(
    @InjectModel(TransactionMongoDBEntity.name)
    private readonly transactionEntity: Model<TransactionMongoDBDocument>,
  ) {}

  async save(transaction: Transaction): Promise<Transaction> {
    try {
      const entity = new this.transactionEntity(transaction);
      const savedEntity = await entity.save();

      return TransactionMongoDBMapper.toModel(savedEntity);
    } catch (error) {
      throw new MongoDBAdapterCustomException(
        'Error saving transaction to MongoDB',
      );
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    try {
      const entity = await this.transactionEntity.findById(id).exec();

      if (!entity) return null;

      return TransactionMongoDBMapper.toModel(entity);
    } catch (error) {
      if (error instanceof Error.CastError) {
        throw new InvalidIdCustomException('Invalid ID format', id);
      }
      throw new MongoDBAdapterCustomException(
        'Error finding transaction by ID in MongoDB',
      );
    }
  }

  async findByUser(userId: string): Promise<Transaction[]> {
    try {
      const entities = await this.transactionEntity
        .find({ userId }, null, { sort: { date: -1 } })
        .exec();

      return entities.map((entity) => TransactionMongoDBMapper.toModel(entity));
    } catch (error) {
      if (error instanceof Error.CastError) {
        throw new InvalidIdCustomException('Invalid ID format', userId);
      }
      throw new MongoDBAdapterCustomException(
        'Error finding transactions by user in MongoDB',
      );
    }
  }
}
