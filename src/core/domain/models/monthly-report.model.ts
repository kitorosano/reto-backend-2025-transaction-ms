import { BadModelException } from 'src/common/errors/exceptions/bad-model.exception';
import { ErrorCodesKeys } from '../../../common/errors/error-code-keys.enum';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class MonthlyReport {
  id: string;
  userId: string; // TODO: change to value object
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  difference: number;
  mostSpentCategory: string; // TODO: change to value object

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

  setMonth(month: number) {
    this.month = month;
  }

  setYear(year: number) {
    this.year = year;
  }

  setTotalIncome(totalIncome: number) {
    this.totalIncome = totalIncome;
  }

  setTotalExpense(totalExpense: number) {
    this.totalExpense = totalExpense;
  }

  calculateDifference() {
    this.difference = this.totalIncome - Math.abs(this.totalExpense);
  }

  calculateMostSpentCategory(
    categoryCount: Record<string, number>,
    defaultCategory: string,
  ) {
    const mostSpentCategoryRecord = Object.entries(categoryCount).reduce(
      (prev, current) => {
        if (prev[1] > current[1]) {
          return prev;
        } else {
          return current;
        }
      },
    );

    if (mostSpentCategoryRecord) {
      this.mostSpentCategory = mostSpentCategoryRecord[0];
    } else {
      this.mostSpentCategory = defaultCategory;
    }
  }
}
