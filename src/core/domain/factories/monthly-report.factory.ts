import { Injectable } from '@nestjs/common';
import { MonthlyReport } from '../models/monthly-report.model';

const DEFAULT_MOST_SPENT_CATEGORY = 'uncategorized';

@Injectable()
export class MonthlyReportFactory {
  create(
    year: number,
    month: number,
    totalIncome: number,
    totalExpense: number,
    categoryCount: Record<string, number>,
  ): MonthlyReport {
    const monthlyReport = new MonthlyReport();
    monthlyReport.setYear(year);
    monthlyReport.setMonth(month);
    monthlyReport.setTotalIncome(totalIncome);
    monthlyReport.setTotalExpense(totalExpense);
    monthlyReport.calculateDifference();
    monthlyReport.calculateMostSpentCategory(
      categoryCount,
      DEFAULT_MOST_SPENT_CATEGORY,
    );

    return monthlyReport;
  }
}
