import { TransactionCurrency } from '../../../common/dto/transaction.dto';
import { ErrorCodesKeys } from '../../../common/errors/error-code-keys.enum';
import { BadModelException } from '../../../common/errors/exceptions/bad-model.exception';

const MAX_DESCRIPTION_LENGTH = 50; // TODO: move to config file
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class Transaction {
  id: string; // TODO: change to TransactionId value object
  userId: string; // TODO: change to UserId value object
  category: string; // TODO: change to Category value object
  amount: number;
  // type: string; // TODO: add field "type" (income/expense)
  currency: TransactionCurrency; // TODO: change to TransactionCurrency value object
  datetime: Date; // TODO: rename to "date"
  description: string;

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

  setCategory(category: string) {
    this.category = category;
  }

  setAmount(amount: number) {
    this.amount = amount;
  }

  setCurrency(currency: TransactionCurrency) {
    this.currency = currency;
  }

  setDatetime(datetime: Date) {
    this.datetime = datetime;
  }

  setDescription(description: string) {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      throw new BadModelException(ErrorCodesKeys.DESCRIPTION_TOO_LARGE);
    }
    this.description = description;
  }
}
