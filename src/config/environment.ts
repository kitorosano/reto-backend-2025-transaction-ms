import 'dotenv/config';
import * as joi from 'joi';

interface Environment {
  NODE_ENV: string;
  PORT: number;
  NATS_SERVERS: string;
  MONGO_URI: string;
}

const environmentSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'testing', 'production')
      .default('development'),
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    MONGO_URI: joi.string().required(),
  })
  .unknown(true);

const { error, value } = environmentSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

const environment: Environment = value as Environment;

export default {
  name: environment.NODE_ENV,
  port: environment.PORT,
  natsServers: environment.NATS_SERVERS,
  mongoUri: environment.MONGO_URI,
};
