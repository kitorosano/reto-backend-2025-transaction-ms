export class InvalidIdCustomException extends Error {
  resource: string;
  constructor(message: string, resource: string) {
    super(message);
    this.name = 'InvalidIdCustomException';
    this.resource = resource;
  }
}

export class MongoDBAdapterCustomException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MongoDBAdapterCustomException';
  }
}
