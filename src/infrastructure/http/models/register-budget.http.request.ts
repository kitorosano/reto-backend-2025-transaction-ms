import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionCurrency } from '../../../common/dto/transaction.dto';

export class RegisterBudgetHTTPRequest {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionCurrency)
  @IsOptional()
  currency?: TransactionCurrency;
}
