import { MonthlyReportDTO } from '../../../common/dto/monthly-report.dto';
import { MonthlyReport } from '../../domain/models/monthly-report.model';

export class MonthlyReportMapper {
  static toDTO(model: MonthlyReport): MonthlyReportDTO {
    const dto = new MonthlyReportDTO();

    dto.year = model.year;
    dto.month = model.month;
    dto.totalIncome = model.totalIncome;
    dto.totalExpense = model.totalExpense;
    dto.difference = model.difference;
    dto.mostSpentCategory = model.mostSpentCategory;

    return dto;
  }
}
