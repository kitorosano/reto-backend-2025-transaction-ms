import { CreateTransactionDTO } from '../../shared/dto/create-transaction.dto';
import { TransactionCurrency } from '../../shared/dto/transaction.dto';

const MAX_DESCRIPTION_LENGTH = 255;
const MIN_AMOUNT = 0;
const DEFAULT_CURRENCY = TransactionCurrency.USD;
const DEFAULT_DESCRIPTION = '';

export class Transaction {
  id: string;
  category: string;
  amount: number;
  currency: TransactionCurrency;
  datetime: Date;
  description: string;
  userId: string;

  private readonly _errors: Map<string, boolean>;

  constructor() {
    this._errors = new Map<string, boolean>();
  }

  create(dto: CreateTransactionDTO): this {
    // this.id = this.generateId();
    this.category = dto.category;
    this.amount = dto.amount;
    this.currency = dto.currency || DEFAULT_CURRENCY;
    this.datetime = new Date(dto.datetime);
    this.description = dto.description || DEFAULT_DESCRIPTION;
    this.userId = dto.userId;

    return this;
  }

  private generateId(): string {
    return crypto.randomUUID(); // TODO: Use a library or method to generate unique IDs
  }

  isValid(): boolean {
    this._errors.clear();

    if (!this.category) {
      this._errors.set('category', true);
    }
    if (!this.amount || this.amount <= MIN_AMOUNT) {
      this._errors.set('amount', true);
    }
    if (!this.datetime) {
      this._errors.set('datetime', true);
    }
    if (this.description && this.description.length > MAX_DESCRIPTION_LENGTH) {
      this._errors.set('description', true);
    }
    if (!this.userId) {
      this._errors.set('userId', true);
    }

    return this._errors.size === 0;
  }

  get errors(): Map<string, boolean> {
    return this._errors;
  }
}
