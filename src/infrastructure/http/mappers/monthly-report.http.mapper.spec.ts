import { MonthlyReportHTTPMapper } from './monthly-report.http.mapper';

const mockUserId = 'user123';

const mockGenerateMonthlyReportRequest = {
  year: '2025',
  month: '5',
  userId: mockUserId,
};

const mockGenerateMonthlyReportDTO = {
  userId: mockUserId,
  year: parseInt(mockGenerateMonthlyReportRequest.year),
  month: parseInt(mockGenerateMonthlyReportRequest.month),
};

const mockMonthlyReportDTO = {
  year: 2025,
  month: 5,
  totalIncome: 100,
  totalExpense: 50,
  difference: 50,
  mostSpentCategory: 'house',
};

const mockMonthlyReportResponse = {
  year: mockMonthlyReportDTO.year,
  month: mockMonthlyReportDTO.month,
  totalIncome: mockMonthlyReportDTO.totalIncome,
  totalExpense: mockMonthlyReportDTO.totalExpense,
  difference: mockMonthlyReportDTO.difference,
  mostSpentCategory: mockMonthlyReportDTO.mostSpentCategory,
};

describe('MonthlyReportHTTPMapper', () => {
  it('should map GenerateMonthlyReportHTTPRequest to GenerateMonthlyReportDTO', () => {
    const dto = MonthlyReportHTTPMapper.toDTO(
      mockGenerateMonthlyReportRequest,
      mockUserId,
    );

    expect(dto).toBeDefined();
    expect(dto.year).toEqual(mockGenerateMonthlyReportDTO.year);
    expect(dto.month).toEqual(mockGenerateMonthlyReportDTO.month);
    expect(dto.userId).toEqual(mockGenerateMonthlyReportDTO.userId);
  });

  it('should map MonthlyReportDTO to MonthlyReportHTTPResponse', () => {
    const response = MonthlyReportHTTPMapper.toResponse(mockMonthlyReportDTO);

    expect(response).toBeDefined();
    expect(response.year).toEqual(mockMonthlyReportResponse.year);
    expect(response.month).toEqual(mockMonthlyReportResponse.month);
    expect(response.totalIncome).toEqual(mockMonthlyReportResponse.totalIncome);
    expect(response.totalExpense).toEqual(
      mockMonthlyReportResponse.totalExpense,
    );
    expect(response.difference).toEqual(mockMonthlyReportResponse.difference);
    expect(response.mostSpentCategory).toEqual(
      mockMonthlyReportResponse.mostSpentCategory,
    );
  });
});
