import { GenerateMonthlyReportDTO } from '../../../shared/dto/generate-monthly-report.dto';
import { MonthlyReportDTO } from '../../../shared/dto/monthly-report.dto';
import { GenerateMonthlyReportHTTPRequest } from '../models/generate-monthly-report.http.request';
import { MonthlyReportHTTPResponse } from '../models/monthly-report.http.response';

export class MonthlyReportHTTPMapper {
  static toDTO(
    request: GenerateMonthlyReportHTTPRequest,
    userId: string,
  ): GenerateMonthlyReportDTO {
    const dto = new GenerateMonthlyReportDTO();

    dto.userId = userId;
    dto.year = parseInt(request.year);
    dto.month = parseInt(request.month);

    return dto;
  }
  static toResponse(dto: MonthlyReportDTO): MonthlyReportHTTPResponse {
    const response = new MonthlyReportHTTPResponse();

    response.year = dto.year;
    response.month = dto.month;
    response.totalIncome = dto.totalIncome;
    response.totalExpense = dto.totalExpense;
    response.difference = dto.difference;
    response.mostSpentCategory = dto.mostSpentCategory;

    return response;
  }
}
