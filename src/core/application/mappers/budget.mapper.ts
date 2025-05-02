import { BudgetDTO } from '../../../shared/dto/budget.dto';
import { Budget } from '../../domain/models/budget.model';

export class BudgetMapper {
  static toDTO(model: Budget): BudgetDTO {
    const dto = new BudgetDTO();

    dto.id = model.id;
    dto.amount = model.amount;
    dto.currency = model.currency;
    dto.category = model.category;
    dto.isActive = model.isActive;

    return dto;
  }
}
