import { IsNotEmpty, IsNumberString } from 'class-validator';

export class GenerateMonthlyReportHTTPRequest {
  @IsNotEmpty()
  @IsNumberString()
  year: string;

  @IsNotEmpty()
  @IsNumberString()
  month: string;
}
