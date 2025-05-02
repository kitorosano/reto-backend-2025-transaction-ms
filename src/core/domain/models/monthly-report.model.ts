export class MonthlyReport {
  id: string;
  userId: string;
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  difference: number;
  mostSpentCategory: string;

  setId(id: string) {
    this.id = id;
  }

  setUserId(userId: string) {
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

  setDifference(difference: number) {
    this.difference = difference;
  }

  setMostSpentCategory(mostSpentCategory: string) {
    this.mostSpentCategory = mostSpentCategory;
  }
}
