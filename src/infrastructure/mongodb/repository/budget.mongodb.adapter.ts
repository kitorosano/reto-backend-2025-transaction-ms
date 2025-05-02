import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { ErrorCodesKeys } from '../../../common/errors/error-code-keys.enum';
import { BadModelException } from '../../../common/errors/exceptions/bad-model.exception';
import { UnexpectedException } from '../../../common/errors/exceptions/unexpected.exception';
import { BudgetRepositoryPort } from '../../../core/application/ports/outbounds/budget.repository.port';
import { Budget } from '../../../core/domain/models/budget.model';
import {
  BudgetMongoDBDocument,
  BudgetMongoDBEntity,
} from '../entities/budget.mongodb.entity';
import { BudgetMongoDBMapper } from '../mappers/budget.mongodb.mapper';

export class BudgetMongoDBAdapter implements BudgetRepositoryPort {
  constructor(
    @InjectModel(BudgetMongoDBEntity.name)
    private readonly budgetEntity: Model<BudgetMongoDBDocument>,
  ) {}

  async save(budget: Budget): Promise<Budget> {
    try {
      const entity = new this.budgetEntity(budget);
      const savedEntity = await entity.save();

      return BudgetMongoDBMapper.toModel(savedEntity);
    } catch (error) {
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error,
      );
    }
  }

  async findByUser(userId: string): Promise<Budget[]> {
    try {
      const entities = await this.budgetEntity
        .find({ userId }, null, { sort: { date: -1 } })
        .exec();

      return entities.map((entity) => BudgetMongoDBMapper.toModel(entity));
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

  async update(budget: Budget): Promise<Budget | null> {
    // Remove the id and userId from the budget object to avoid updating them in the database
    const { id, userId, ...budgetToUpdate } = budget;

    try {
      const entity = await this.budgetEntity
        .findOneAndUpdate({ id }, budgetToUpdate, { new: true })
        .exec();

      if (!entity) return null;

      return BudgetMongoDBMapper.toModel(entity);
    } catch (error) {
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error,
      );
    }
  }

  async delete(id: string, userId: string): Promise<Budget | null> {
    try {
      const entity = await this.budgetEntity
        .findOneAndDelete({ id, userId })
        .exec();

      if (!entity) return null;

      return BudgetMongoDBMapper.toModel(entity);
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
