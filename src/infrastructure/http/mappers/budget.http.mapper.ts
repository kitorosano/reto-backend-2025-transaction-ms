import { BudgetDTO } from '../../../common/dto/budget.dto';
import { RegisterBudgetDTO } from '../../../common/dto/register-budget.dto';
import { BudgetHTTPResponse } from '../models/budget.http.response';
import { RegisterBudgetHTTPRequest } from '../models/register-budget.http.request';

export class BudgetHTTPMapper {
  static toDTO(
    request: RegisterBudgetHTTPRequest,
    userId: string,
  ): RegisterBudgetDTO {
    const dto = new RegisterBudgetDTO();

    dto.userId = userId;
    dto.amount = request.amount;
    dto.currency = request.currency;
    dto.category = request.category;

    return dto;
  }
  static toResponse(dto: BudgetDTO): BudgetHTTPResponse {
    const response = new BudgetHTTPResponse();

    response.id = dto.id;
    response.category = dto.category;
    response.amount = dto.amount;
    response.currency = dto.currency;
    response.isActive = dto.isActive;

    return response;
  }
}
