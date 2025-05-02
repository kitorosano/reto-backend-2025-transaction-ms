import { Injectable } from '@nestjs/common';
import { RegisterTransactionDTO } from '../../../shared/dto/create-transaction.dto';
import { Log } from '../../../shared/utils/log';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionService } from '../../domain/services/transaction.service';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';

@Injectable()
export class RegisterTransactionUseCase {
  constructor(
    private repository: TransactionRepositoryPort,
    private service: TransactionService,
  ) {}

  async execute(dto: RegisterTransactionDTO): Promise<Transaction> {
    Log.info(
      'RegisterTransactionUseCase',
      `Creating new transaction for USERID ${dto.userId}`,
    );

    const transaction = this.service.create({
      userId: dto.userId,
      datetime: dto.datetime,
      amount: dto.amount,
      currency: dto.currency,
      category: dto.category,
      description: dto.description,
    });
    const transactionCreated = await this.repository.save(transaction);

    Log.info(
      'RegisterTransactionUseCase',
      `Transaction created successfully with ID ${transactionCreated.id}`,
    );

    return transactionCreated;
  }
}
