import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import environment from './config/environment';
import { Log } from './shared/utils/log';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule.register({
      driver: environment.driver,
    }),
  );

  await app.listen(environment.port);

  Log.info(
    'Main',
    `Transactions microservice is running on port`,
    environment.port,
  );
}
bootstrap();
