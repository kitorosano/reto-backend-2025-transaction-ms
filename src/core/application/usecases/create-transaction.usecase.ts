import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from '../../../shared/dto/create-transaction.dto';
import { Log } from '../../../shared/utils/log';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionService } from '../../domain/services/transaction.service';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private repository: TransactionRepositoryPort,
    private service: TransactionService,
  ) {}

  async execute(dto: CreateTransactionDTO): Promise<Transaction> {
    Log.info(
      'CreateTransactionUseCase',
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
      'CreateTransactionUseCase',
      `Transaction created successfully with ID ${transactionCreated.id}`,
    );

    return transactionCreated;
  }
}
