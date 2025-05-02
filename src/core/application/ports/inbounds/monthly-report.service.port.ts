import { GenerateMonthlyReportDTO } from '../../../../shared/dto/generate-monthly-report.dto';
import { MonthlyReportDTO } from '../../../../shared/dto/monthly-report.dto';

export abstract class MonthlyReportServicePort {
  abstract generateMonthlyReport(
    transaction: GenerateMonthlyReportDTO, // TODO: rename variable to match the class name
  ): Promise<MonthlyReportDTO>;
}
