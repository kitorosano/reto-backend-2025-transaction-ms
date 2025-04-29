import 'dotenv/config';
import * as joi from 'joi';

interface Environment {
  PORT: number;
  NATS_SERVERS: string;
  MONGO_URI: string;
}

const environmentSchema = joi
  .object({
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
  port: environment.PORT,
  natsServers: environment.NATS_SERVERS,
  mongoUri: environment.MONGO_URI,
};
