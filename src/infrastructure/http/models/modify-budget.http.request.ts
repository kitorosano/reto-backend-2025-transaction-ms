import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';

export class ModifyBudgetHTTPRequest {
  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsEnum(TransactionCurrency)
  @IsOptional()
  currency?: TransactionCurrency;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
