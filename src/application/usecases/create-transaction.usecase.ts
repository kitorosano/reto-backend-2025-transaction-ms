import { Injectable } from '@nestjs/common';
import { TransactionService } from '../../domain/transaction.service';
import { CreateTransactionDTO } from '../../shared/dto/create-transaction.dto';
import { TransactionDTO } from '../../shared/dto/transaction.dto';
import { Log } from '../../shared/log';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private service: TransactionService) {}

  execute(dto: CreateTransactionDTO): Promise<TransactionDTO> {
    Log.info(
      'CreateTransactionUseCase',
      `Creating new transaction for userId ${dto.userId}`,
    );
    return this.service.createTransaction(dto);
  }
}
