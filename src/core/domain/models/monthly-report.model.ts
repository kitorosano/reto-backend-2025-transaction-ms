import { InvalidModelPropertyValueException } from '../../../common/exceptions/domain.exceptions';

export class MonthlyReport {
  id: string;
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  difference: number;
  mostSpentCategory: string;

  // Business logic
  // TODO: add business logic methods if needed

  // Setters
  setId(id: string) {
    this.id = id;
  }

  setMonth(month: number) {
    if (!month) {
      throw new InvalidModelPropertyValueException('Month cannot be empty');
    }
    this.month = month;
  }

  setYear(year: number) {
    if (!year) {
      throw new InvalidModelPropertyValueException('Year cannot be empty');
    }
    this.year = year;
  }

  setTotalIncome(totalIncome: number) {
    if (!totalIncome) {
      throw new InvalidModelPropertyValueException(
        'TotalIncome cannot be empty',
      );
    }
    this.totalIncome = totalIncome;
  }

  setTotalExpense(totalExpense: number) {
    if (!totalExpense) {
      throw new InvalidModelPropertyValueException(
        'TotalExpense cannot be empty',
      );
    }
    this.totalExpense = totalExpense;
  }

  calculateDifference() {
    if (!this.totalIncome || !this.totalExpense) {
      throw new InvalidModelPropertyValueException(
        'Difference cannot be calculated without totalIncome and totalExpense',
      );
    }
    this.difference = this.totalIncome - Math.abs(this.totalExpense);
  }

  calculateMostSpentCategory(
    categoryCount: Record<string, number>,
    defaultCategory: string,
  ) {
    if (!categoryCount) {
      throw new InvalidModelPropertyValueException(
        'MostSpentCategory cannot be calculated without categoryCount',
      );
    }
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
