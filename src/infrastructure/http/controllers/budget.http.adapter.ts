import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Log } from '../../../common/log';
import { BudgetsServicePort } from '../../../core/application/ports/inbounds/budgets.service.port';
import { UserId } from '../common/decorators/user-id.decorator';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestValidationPipe } from '../common/pipes/requests-validation.pipe';
import { BudgetHTTPMapper } from '../mappers/budget.http.mapper';
import { BudgetHTTPResponse } from '../models/budget.http.response';
import { RegisterBudgetHTTPRequest } from '../models/register-budget.http.request';

@Controller('budgets')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(RequestValidationPipe)
@UseGuards(AuthGuard)
export class BudgetHTTPAdapter {
  constructor(private application: BudgetsServicePort) {}

  @Post()
  @HttpCode(201)
  async registerBudget(
    @Body() request: RegisterBudgetHTTPRequest,
    @UserId() userId: string,
  ): Promise<BudgetHTTPResponse> {
    Log.info('ReportHTTPAdapter', `(GET) Register budget for userId ${userId}`);

    const dto = BudgetHTTPMapper.toDTO(request, userId);

    const budget = await this.application.registerBudget(dto);

    return BudgetHTTPMapper.toResponse(budget);
  }

  @Get()
  @HttpCode(200)
  async getUserBudgets(
    @UserId() userId: string,
  ): Promise<BudgetHTTPResponse[]> {
    Log.info('BudgetHTTPAdapter', `(GET) Get Budgets by USERID ${userId}`);

    const budgets = await this.application.getUserBudgets(userId);

    return budgets.map((budget) => BudgetHTTPMapper.toResponse(budget));
  }
}
