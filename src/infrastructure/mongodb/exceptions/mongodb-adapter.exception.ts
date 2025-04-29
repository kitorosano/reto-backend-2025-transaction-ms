export class MongoDBAdapterCustomException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MongoDBAdapterCustomException';
  }
}
