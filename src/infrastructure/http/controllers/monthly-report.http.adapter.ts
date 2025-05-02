import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { MonthlyReportServicePort } from '../../../core/application/ports/inbounds/monthly-report.service.port';
import { Log } from '../../../shared/utils/log';
import { UserId } from '../common/decorators/user-id.decorator';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestValidationPipe } from '../common/pipes/requests-validation.pipe';
import { MonthlyReportHTTPMapper } from '../mappers/monthly-report.http.mapper';
import { GenerateMonthlyReportHTTPRequest } from '../models/generate-monthly-report.http.request';
import { MonthlyReportHTTPResponse } from '../models/monthly-report.http.response';

@Controller('reports')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(RequestValidationPipe)
@UseGuards(AuthGuard)
export class MonthlyReportHTTPAdapter {
  constructor(private application: MonthlyReportServicePort) {}

  @Get(':year/:month')
  @HttpCode(200)
  async generateMonthlyReport(
    @Param() params: GenerateMonthlyReportHTTPRequest,
    @UserId() userId: string,
  ): Promise<MonthlyReportHTTPResponse> {
    Log.info(
      'ReportHTTPAdapter',
      `(GET) Generate monthly report for userId ${userId}`,
    );

    const dto = MonthlyReportHTTPMapper.toDTO(params, userId);

    const report = await this.application.generateMonthlyReport(dto);

    return MonthlyReportHTTPMapper.toResponse(report);
  }
}
