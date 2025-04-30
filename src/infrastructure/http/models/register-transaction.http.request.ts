import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionCurrency } from '../../../common/dto/transaction.dto';

export class RegisterTransactionHTTPRequest {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionCurrency)
  @IsOptional()
  currency?: TransactionCurrency;

  @IsDateString()
  @IsNotEmpty()
  datetime: string;

  @IsString()
  @IsOptional()
  description?: string;
}
