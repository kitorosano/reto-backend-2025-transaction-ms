import { Injectable } from '@nestjs/common';
import { TransactionService } from '../../domain/transaction.service';
import { TransactionDTO } from '../../shared/dto/transaction.dto';
import { Log } from '../../shared/log';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(private transactionService: TransactionService) {}

  async execute(id: string): Promise<TransactionDTO> {
    Log.info('GetTransactionByIdUseCase', `Getting transaction with id ${id}`);

    const transaction = await this.transactionService.getTransactionById(id);

    Log.info(
      'GetTransactionByIdUseCase',
      `Transaction with id ${id} retrieved successfully`,
    );

    return transaction;
  }
}

// TODO: Check if this is a requirement for the project
