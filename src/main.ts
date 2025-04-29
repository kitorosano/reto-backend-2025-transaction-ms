import { NestFactory } from '@nestjs/core';
import environment from './config/environment';
import { TransactionModule } from './infrastructure/transaction.module';
import { Log } from './shared/log';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);

  await app.listen(environment.port);

  Log.info(
    'Main',
    `Transactions microservice is running on port`,
    environment.port,
  );
}
bootstrap();
