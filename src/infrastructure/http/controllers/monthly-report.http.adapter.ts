import {
  Controller,
  Get,
  HttpCode,
  Param,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Log } from '../../../common/log';
import { customValidationPipeExceptionFactory } from '../../../common/utils';
import { GenerateMonthlyReportUseCase } from '../../../core/application/usecases/generate-monthly-report.usecase';
import { BadRequestExceptionFilter } from '../filters/bad-request-exception.filter';
import { MonthlyReportHTTPMapper } from '../mappers/monthly-report.http.mapper';
import { GenerateMonthlyReportHTTPRequest } from '../models/generate-monthly-report.http.request';
import { MonthlyReportHTTPResponse } from '../models/monthly-report.http.response';

@Controller('reports')
export class MonthlyReportHTTPAdapter {
  constructor(
    private generateMonthlyReportUseCase: GenerateMonthlyReportUseCase,
  ) {}

  @Get(':year/:month')
  @HttpCode(200)
  async generateMonthlyReport(
    @Param() params: GenerateMonthlyReportHTTPRequest,
  ): Promise<MonthlyReportHTTPResponse> {
    const userId = '1'; // This should be replaced with actual user ID from request context or token
    Log.info(
      'ReportHTTPAdapter',
      `(GET) Generate monthly report for userId ${userId}`,
    );

    const dto = MonthlyReportHTTPMapper.toDTO(params, userId);

    const report = await this.generateMonthlyReportUseCase.execute(dto);

    return MonthlyReportHTTPMapper.toResponse(report);
  }
}
