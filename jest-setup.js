process.env.NODE_ENV = 'testing';
process.env.PORT = 3002;

process.env.NATS_SERVERS = 'nats://localhost:4222,nats://localhost:4223';

process.env.PERSISTENCE_DRIVER = 'mongodb';
process.env.PERSISTENCE_DRIVER_URI =
  'mongodb://localhost:27017/transactions-ms';

process.env.AUTH_DRIVER = 'jwt';
process.env.AUTH_DRIVER_SECRET = 'secret';
