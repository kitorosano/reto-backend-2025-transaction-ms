import {
  IsDate,
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

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  @IsEnum(TransactionCurrency)
  currency?: TransactionCurrency;

  @IsNotEmpty()
  @IsDate()
  datetime: string;

  @IsString()
  @IsOptional()
  description?: string;
}
