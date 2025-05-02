import { Injectable } from '@nestjs/common';
import { RegisterTransactionDTO } from '../../../shared/dto/create-transaction.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { Log } from '../../../shared/utils/log';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionService } from '../../domain/services/transaction.service';
import { BudgetRepositoryPort } from '../ports/outbounds/budget.repository.port';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';

@Injectable()
export class RegisterTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepositoryPort,
    private budgetRepository: BudgetRepositoryPort,
    private service: TransactionService,
  ) {}

  async execute(dto: RegisterTransactionDTO): Promise<Transaction> {
    Log.info(
      'RegisterTransactionUseCase',
      `Creating new transaction for USERID ${dto.userId}`,
    );

    // Check if the user has a budget for the transaction category
    const budget = await this.budgetRepository.findByUserAndCategory(
      dto.userId,
      dto.category,
    );

    if (budget) {
      // If the user has a budget for the transaction category
      // First, find all transactions for the user, category, and month
      const startDate = new Date(
        dto.datetime.getFullYear(),
        dto.datetime.getMonth(),
        1,
      ); // TODO: make this a utility function
      const endDate = new Date(
        dto.datetime.getFullYear(),
        dto.datetime.getMonth() + 1,
        0,
      ); // TODO: make this a utility function

      const transactions =
        await this.transactionRepository.findByUserAndDateRangeAndCategory(
          dto.userId,
          startDate,
          endDate,
          dto.category,
        );

      // Calculate the total amount of all transactions.
      let totalAmount = 0;
      transactions.forEach((transaction) => {
        totalAmount += transaction.amount;
      });

      // Add the new transaction amount to the total amount
      totalAmount += dto.amount;

      // Check if the total amount exceeds the budget
      if (totalAmount > budget.amount) {
        Log.error(
          'RegisterTransactionUseCase',
          `Transaction amount exceeds the budget for USERID ${dto.userId}`,
        );
        throw new BadModelException(ErrorCodesKeys.AMOUNT_EXCEEDS_BUDGET);
      }
    }

    // If the user does not have a budget for the transaction category, or if the transaction amount is within the budget, create the transaction

    const transaction = this.service.create({
      userId: dto.userId,
      datetime: dto.datetime,
      amount: dto.amount,
      currency: dto.currency,
      category: dto.category,
      description: dto.description,
    });
    const transactionCreated =
      await this.transactionRepository.save(transaction);

    Log.info(
      'RegisterTransactionUseCase',
      `Transaction created successfully with ID ${transactionCreated.id}`,
    );

    return transactionCreated;
  }
}
