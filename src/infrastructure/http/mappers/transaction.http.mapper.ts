import { RegisterTransactionDTO } from '../../../shared/dto/create-transaction.dto';
import {
  TransactionCurrency,
  TransactionDTO,
} from '../../../shared/dto/transaction.dto';
import { RegisterTransactionHTTPRequest } from '../models/register-transaction.http.request';
import { TransactionHTTPResponse } from '../models/transaction.http.response';

export class TransactionHTTPMapper {
  static toDTO(
    request: RegisterTransactionHTTPRequest,
    userId: string,
  ): RegisterTransactionDTO {
    const dto = new RegisterTransactionDTO();

    dto.category = request.category;
    dto.amount = request.amount;
    dto.currency = request.currency;
    dto.datetime = new Date(request.datetime);
    dto.description = request.description;
    dto.userId = userId;

    return dto;
  }

  static toResponse(dto: TransactionDTO): TransactionHTTPResponse {
    const response = new TransactionHTTPResponse();

    response.id = dto.id;
    response.category = dto.category;
    response.amount = dto.amount;
    response.currency = TransactionCurrency[dto.currency];
    response.date = dto.datetime;
    response.description = dto.description;

    return response;
  }
}
