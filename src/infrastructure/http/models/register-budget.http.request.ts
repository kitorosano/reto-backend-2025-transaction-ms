import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionCurrency } from '../../../shared/dto/transaction.dto';

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
  @IsNotEmpty()
  currency: TransactionCurrency;
}
