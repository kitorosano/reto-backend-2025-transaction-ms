import { TransactionCurrency } from '../../../common/dto/transaction.dto';
import { ErrorCodesKeys } from '../../../common/errors/error-code-keys.enum';
import { BadModelException } from '../../../common/errors/exceptions/bad-model.exception';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class Budget {
  id: string; // TODO: change to value object
  userId: string; // TODO: change to UserId value object
  amount: number;
  currency: TransactionCurrency; // TODO: change to value object
  category: string; // TODO: change to value object
  isActive: boolean;

  // Business logic
  // TODO: add business logic methods if needed

  generateId() {
    this.id = crypto.randomUUID();
  }

  setId(id: string) {
    if (!UUID_REGEX.test(id)) {
      throw new BadModelException(ErrorCodesKeys.ID_FORMAT_NOT_VALID);
    }
    this.id = id;
  }

  setUserId(userId: string) {
    if (!UUID_REGEX.test(userId)) {
      throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID);
    }
    this.userId = userId;
  }

  setAmount(amount: number) {
    this.amount = amount;
  }

  setCurrency(currency: TransactionCurrency) {
    this.currency = currency;
  }

  setCategory(category: string) {
    this.category = category;
  }

  setIsActive(isActive: boolean) {
    this.isActive = isActive;
  }
}
