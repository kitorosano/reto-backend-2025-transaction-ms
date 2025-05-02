import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';

export class RegisterTransactionHTTPRequest {
  @IsDateString()
  @IsNotEmpty()
  datetime: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionCurrency)
  @IsNotEmpty()
  currency: TransactionCurrency;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;
}
