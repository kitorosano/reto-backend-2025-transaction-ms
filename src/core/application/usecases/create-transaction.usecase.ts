import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from '../../../common/dto/create-transaction.dto';
import { Log } from '../../../common/log';
import { TransactionFactory } from '../../domain/factories/transaction.factory';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepositoryPort } from '../ports/outbounds/transaction.repository.port';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private repository: TransactionRepositoryPort,
    private factory: TransactionFactory,
  ) {}

  async execute(dto: CreateTransactionDTO): Promise<Transaction> {
    Log.info(
      'CreateTransactionUseCase',
      `Creating new transaction for USERID ${dto.userId}`,
    );

    const transaction = this.factory.createFromDTO(dto);
    const transactionCreated = await this.repository.save(transaction);

    Log.info(
      'CreateTransactionUseCase',
      `Transaction created successfully with ID ${transactionCreated.id}`,
    );

    return transactionCreated;
  }
}
