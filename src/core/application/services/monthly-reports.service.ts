import { Injectable } from '@nestjs/common';
import { GenerateMonthlyReportUseCase } from '../usecases/generate-monthly-report.usecase';
import { GenerateMonthlyReportDTO } from '../../../common/dto/generate-monthly-report.dto';
import { MonthlyReportServicePort } from '../ports/inbounds/monthly-report.service.port';
import { MonthlyReportDTO } from '../../../common/dto/monthly-report.dto';
import { MonthlyReportMapper } from '../mappers/monthly-report.mapper';

@Injectable()
export class MonthlyReportService implements MonthlyReportServicePort {
  constructor(
    private readonly generateMonthlyReportUseCase: GenerateMonthlyReportUseCase,
  ) {}

  async generateMonthlyReport(dto: GenerateMonthlyReportDTO): Promise<MonthlyReportDTO> {
    const monthlyReport = await this.generateMonthlyReportUseCase.execute(dto);
    return MonthlyReportMapper.toDTO(monthlyReport);
  }
}
