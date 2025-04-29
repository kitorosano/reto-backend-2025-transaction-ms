import { Injectable } from '@nestjs/common';
import { TransactionService } from '../../domain/transaction.service';
import { TransactionDTO } from '../../shared/dto/transaction.dto';
import { Log } from '../../shared/log';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(private transactionService: TransactionService) {}

  execute(id: string): Promise<TransactionDTO> {
    Log.info('GetTransactionByIdUseCase', `Getting transaction with id ${id}`);
    return this.transactionService.getTransactionById(id);
  }
}
