import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import {
  InvalidEntityPropValueException,
  UnexpectedRepositoryException,
} from '../../../common/exceptions/infrastructure.exceptions';
import { TransactionRepositoryPort } from '../../../core/application/ports/outbounds/transaction.repository.port';
import { Transaction } from '../../../core/domain/models/transaction.model';
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
    try {
      const entity = new this.transactionEntity(transaction);
      const savedEntity = await entity.save();

      return TransactionMongoDBMapper.toModel(savedEntity);
    } catch (error) {
      throw new UnexpectedRepositoryException('Error saving transaction');
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    try {
      const entity = await this.transactionEntity.findById(id).exec();

      if (!entity) return null;

      return TransactionMongoDBMapper.toModel(entity);
    } catch (error) {
      if (error instanceof Error.CastError) {
        throw new InvalidEntityPropValueException('Invalid ID format', id);
      }
      throw new UnexpectedRepositoryException(
        'Error finding transaction by ID',
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
        throw new InvalidEntityPropValueException('Invalid ID format', userId);
      }
      throw new UnexpectedRepositoryException(
        'Error finding transactions by user',
      );
    }
  }

  async findByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    try {
      const entities = await this.transactionEntity
        .find({
          userId,
          datetime: { $gte: startDate, $lte: endDate },
        })
        .exec();

      return entities.map((entity) => TransactionMongoDBMapper.toModel(entity));
    } catch (error) {
      if (error instanceof Error.CastError) {
        throw new InvalidEntityPropValueException('Invalid ID format', userId);
      }
      throw new UnexpectedRepositoryException(
        'Error finding transactions by user and date range',
      );
    }
  }
}
