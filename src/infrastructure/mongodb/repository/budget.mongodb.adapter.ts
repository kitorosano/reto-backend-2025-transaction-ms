import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorCodesKeys } from '../../../common/errors/error-code-keys.enum';
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
}
