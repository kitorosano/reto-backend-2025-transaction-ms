import { MonthlyReport } from '../../domain/models/monthly-report.model';
import { MonthlyReportMapper } from './monthly-report.mapper';

const mockMonthlyReport = {
  id: 'f7f85634-18f1-40bd-8265-430eebbfa48g',
  year: 2025,
  month: 5,
  totalIncome: 100,
  totalExpense: 50,
  difference: 50,
  mostSpentCategory: 'house',
};

describe('MonthlyReportMapper', () => {
  it('should map MonthlyReport model to MonthlyReportDTO', () => {
    const monthlyReportModel = new MonthlyReport();
    monthlyReportModel.id = mockMonthlyReport.id;
    monthlyReportModel.year = mockMonthlyReport.year;
    monthlyReportModel.month = mockMonthlyReport.month;
    monthlyReportModel.totalIncome = mockMonthlyReport.totalIncome;
    monthlyReportModel.totalExpense = mockMonthlyReport.totalExpense;
    monthlyReportModel.difference = mockMonthlyReport.difference;
    monthlyReportModel.mostSpentCategory = mockMonthlyReport.mostSpentCategory;

    const monthlyReportDTO = MonthlyReportMapper.toDTO(monthlyReportModel);

    expect(monthlyReportDTO).toBeDefined();
    expect(monthlyReportDTO.year).toEqual(monthlyReportModel.year);
    expect(monthlyReportDTO.month).toEqual(monthlyReportModel.month);
    expect(monthlyReportDTO.totalIncome).toEqual(
      monthlyReportModel.totalIncome,
    );
    expect(monthlyReportDTO.totalExpense).toEqual(
      monthlyReportModel.totalExpense,
    );
    expect(monthlyReportDTO.difference).toEqual(monthlyReportModel.difference);
    expect(monthlyReportDTO.mostSpentCategory).toEqual(
      monthlyReportModel.mostSpentCategory,
    );
  });
});
