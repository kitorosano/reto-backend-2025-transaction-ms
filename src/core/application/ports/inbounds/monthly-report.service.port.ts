import { GenerateMonthlyReportDTO } from '../../../../common/dto/generate-monthly-report.dto';
import { MonthlyReportDTO } from '../../../../common/dto/monthly-report.dto';

export abstract class MonthlyReportServicePort {
  abstract generateMonthlyReport(
    transaction: GenerateMonthlyReportDTO,
  ): Promise<MonthlyReportDTO>;
}
