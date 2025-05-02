import { TransactionDTO } from '../../../shared/dto/transaction.dto';
import { Transaction } from '../../domain/models/transaction.model';

export class TransactionMapper {
  static toDTO(model: Transaction): TransactionDTO {
    const dto = new TransactionDTO();

    dto.id = model.id;
    dto.category = model.category;
    dto.amount = model.amount;
    dto.currency = model.currency;
    dto.datetime = model.datetime;
    dto.description = model.description;

    return dto;
  }
}
