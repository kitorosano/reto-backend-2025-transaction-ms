import { Injectable } from '@nestjs/common';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { MonthlyReport } from '../models/monthly-report.model';
import { UuidService } from './uuid.service';

interface CreateMonthlyReport {
  userId: string;
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  categoryCount: Record<string, number>;
}

@Injectable()
export class MonthlyReportService {
  private readonly MAX_CATEGORY_LENGTH = 20;
  private readonly DEFAULT_MOST_SPENT_CATEGORY: string = '';

  constructor(private readonly uuidService: UuidService) {}

  create({
    userId,
    year,
    month,
    totalIncome,
    totalExpense,
    categoryCount,
  }: CreateMonthlyReport): MonthlyReport {
    const monthlyReport = new MonthlyReport();

    monthlyReport.setId(this.uuidService.generate());

    if (this.validateUserId(userId)) monthlyReport.setUserId(userId);

    if (this.validateYear(year)) monthlyReport.setYear(year);

    if (this.validateMonth(month)) monthlyReport.setMonth(month);

    if (this.validateAmount(totalIncome))
      monthlyReport.setTotalIncome(totalIncome);

    if (this.validateAmount(totalExpense))
      monthlyReport.setTotalExpense(totalExpense);

    const difference = this.calculateDifference(totalIncome, totalExpense);
    monthlyReport.setDifference(difference);

    const mostSpentCategory = this.calculateMostSpentCategory(categoryCount);
    if (this.validateMostSpentCategory(mostSpentCategory))
      monthlyReport.setMostSpentCategory(mostSpentCategory);

    return monthlyReport;
  }

  validateId(id: string): boolean {
    const isValid = this.uuidService.validate(id);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.ID_FORMAT_NOT_VALID);
  }

  validateUserId(id: string): boolean {
    const isValid = this.uuidService.validate(id);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID);
  }

  private calculateDifference(totalIncome: number, totalExpense: number) {
    return totalIncome - Math.abs(totalExpense);
  }

  private calculateMostSpentCategory(categoryCount: Record<string, number>) {
    const spentCategories = Object.entries(categoryCount);

    if (spentCategories.length === 0) return this.DEFAULT_MOST_SPENT_CATEGORY;

    const mostSpentCategoryRecord = spentCategories.reduce((prev, current) => {
      if (prev[1] > current[1]) {
        return prev;
      } else {
        return current;
      }
    });

    return mostSpentCategoryRecord[0];
  }

  private validateYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    const isValid = year >= 2000 && year <= currentYear;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for year validation
  }

  private validateMonth(month: number): boolean {
    const isValid = month >= 1 && month <= 12;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for month validation
  }

  private validateAmount(totalIncome: number): boolean {
    const isValid = !isNaN(totalIncome);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for total income validation
  }

  private validateMostSpentCategory(category: string): boolean {
    const isValid = category.length <= this.MAX_CATEGORY_LENGTH;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID); // TODO: create a specific error code for category validation
  }
}
