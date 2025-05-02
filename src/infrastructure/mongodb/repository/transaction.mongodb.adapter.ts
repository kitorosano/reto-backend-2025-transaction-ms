import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { TransactionRepositoryPort } from '../../../core/application/ports/outbounds/transaction.repository.port';
import { Transaction } from '../../../core/domain/models/transaction.model';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
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
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error,
      );
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    try {
      const entity = await this.transactionEntity.findOne({ id }).exec();

      if (!entity) return null;

      return TransactionMongoDBMapper.toModel(entity);
    } catch (error) {
      if (error instanceof Error.CastError) {
        throw new BadModelException(ErrorCodesKeys.ID_FORMAT_NOT_VALID);
      }
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error,
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
        throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID); // TODO: check if this is necessary after validating the userId in the application layer
      }
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error,
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
        throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID); // TODO: check if this is necessary after validating the userId in the application layer
      }
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error,
      );
    }
  }

  async findByUserAndDateRangeAndCategory(
    userId: string,
    startDate: Date,
    endDate: Date,
    category: string,
  ): Promise<Transaction[]> {
    try {
      const entities = await this.transactionEntity
        .find({
          userId,
          datetime: { $gte: startDate, $lte: endDate },
          category,
        })
        .exec();

      return entities.map((entity) => TransactionMongoDBMapper.toModel(entity));
    } catch (error) {
      if (error instanceof Error.CastError) {
        throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID); // TODO: check if this is necessary after validating the userId in the application layer
      }
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error,
      );
    }
  }
}
