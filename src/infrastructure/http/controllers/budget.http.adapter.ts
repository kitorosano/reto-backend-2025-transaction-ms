import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
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
import { ModifyBudgetHTTPRequest } from '../models/modify-budget.http.request';
import { RegisterBudgetHTTPRequest } from '../models/register-budget.http.request';

@Controller('budgets')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor) // TODO: Check if this is needed
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

    const dto = BudgetHTTPMapper.toRegisterDTO(request, userId);

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

  @Put(':id')
  @HttpCode(200)
  async modifyUserBudget(
    @Body() request: ModifyBudgetHTTPRequest,
    @Param('id') budgetId: string,
    @UserId() userId: string,
  ): Promise<BudgetHTTPResponse> {
    Log.info('BudgetHTTPAdapter', `(PUT) Modify budget for userId ${userId}`);

    const dto = BudgetHTTPMapper.toModifyDTO(request, userId);

    const budget = await this.application.modifyUserBudget(budgetId, dto);

    return BudgetHTTPMapper.toResponse(budget);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeUserBudget(
    @Param('id') budgetId: string,
    @UserId() userId: string,
  ): Promise<void> {
    Log.info(
      'BudgetHTTPAdapter',
      `(DELETE) Remove budget from userId ${userId}`,
    );

    await this.application.removeUserBudget(budgetId, userId);

    return;
  }
}
