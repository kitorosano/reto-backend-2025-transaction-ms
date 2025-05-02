import { Injectable } from '@nestjs/common';
import { GenerateMonthlyReportDTO } from '../../../common/dto/generate-monthly-report.dto';
import { Log } from '../../../common/log';
import { MonthlyReport } from '../../domain/models/monthly-report.model';
import { MonthlyReportService } from '../../domain/services/monthly-report.service';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';

@Injectable()
export class GenerateMonthlyReportUseCase {
  constructor(
    private repository: TransactionRepositoryPort,
    private service: MonthlyReportService,
  ) {}

  async execute(dto: GenerateMonthlyReportDTO): Promise<MonthlyReport> {
    const { userId, year, month } = dto;
    Log.info(
      'GenerateMonthlyReportUseCase',
      `Generating report from ${year}/${month}, for USERID ${userId}`,
    );

    this.service.validateUserId(userId);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    endDate.setHours(23, 59, 59, 999); // Set to the end of the day

    const transactions = await this.repository.findByUserAndDateRange(
      userId,
      startDate,
      endDate,
    );

    Log.info(
      'GenerateMonthlyReportUseCase',
      `Transactions (${transactions.length}) retrieved successfully, for USERID ${userId}`,
    );

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryCount: Record<string, number> = {};

    transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount;
      } else if (transaction.amount < 0) {
        totalExpense += Math.abs(transaction.amount);

        if (categoryCount[transaction.category]) {
          categoryCount[transaction.category]++;
        } else {
          categoryCount[transaction.category] = 1;
        }
      }
    });

    const monthlyReport = this.service.create({
      userId,
      year,
      month,
      totalIncome,
      totalExpense,
      categoryCount,
    });

    Log.info(
      'GenerateMonthlyReportUseCase',
      `Report generated successfully with ID ${monthlyReport.id}`,
    );

    return monthlyReport;
  }
}
