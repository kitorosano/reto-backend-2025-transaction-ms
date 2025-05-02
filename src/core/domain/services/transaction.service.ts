import { Injectable } from '@nestjs/common';
import { TransactionCurrency } from 'src/shared/dto/transaction.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { Transaction } from '../models/transaction.model';
import { UuidService } from './uuid.service';

interface RegisterTransaction {
  userId: string;
  amount: number;
  datetime: Date;
  currency: TransactionCurrency;
  category: string;
  description?: string;
}

@Injectable()
export class TransactionService {
  private readonly DEFAULT_CATEGORY: string = 'uncategorized';
  private readonly MAX_CATEGORY_LENGTH = 20;
  private readonly DEFAULT_DESCRIPTION: string = '';
  private readonly MAX_DESCRIPTION_LENGTH = 50;

  constructor(private readonly uuidService: UuidService) {}

  create({
    userId,
    amount,
    datetime,
    currency,
    category,
    description,
  }: RegisterTransaction): Transaction {
    const transaction = new Transaction();

    transaction.setId(this.uuidService.generate());

    if (this.validateUserId(userId)) transaction.setUserId(userId);

    if (this.validateDatetime(datetime)) transaction.setDatetime(datetime);

    if (this.validateAmount(amount)) transaction.setAmount(amount);

    if (this.validateCurrency(currency)) transaction.setCurrency(currency);

    category = category || this.DEFAULT_CATEGORY;
    if (this.validateCategory(category)) transaction.setCategory(category);

    description = description || this.DEFAULT_DESCRIPTION;
    if (this.validateDescription(description))
      transaction.setDescription(description);

    return transaction;
  }

  validateId(id: string): boolean {
    const isValid = this.uuidService.validate(id);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.ID_FORMAT_NOT_VALID);
  }

  validateUserId(id: string): boolean {
    const isValid = this.uuidService.validate(id);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID); // TODO: maybe this should be a 401 error instead of a 400 error
  }

  private validateDatetime(datetime: Date): boolean {
    const isValid = !isNaN(datetime.getTime());

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for datetime validation
  }

  private validateAmount(amount: number): boolean {
    const isValid = !isNaN(amount);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for amount validation
  }

  private validateCurrency(currency: TransactionCurrency): boolean {
    const isValid = Object.values(TransactionCurrency).includes(currency);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for currency validation
  }

  private validateCategory(category: string): boolean {
    const isValid =
      category.length > 0 && category.length <= this.MAX_CATEGORY_LENGTH;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for category validation
  }

  private validateDescription(description: string): boolean {
    const isValid = description.length <= this.MAX_DESCRIPTION_LENGTH;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.DESCRIPTION_TOO_LARGE);
  }
}
