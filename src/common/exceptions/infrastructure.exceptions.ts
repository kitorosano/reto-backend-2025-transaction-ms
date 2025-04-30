export class InvalidRequestPropValueException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRequestValueException';
  }
}

export class InvalidEntityPropValueException extends Error {
  resource: string;
  constructor(message: string, resource: string) {
    super(message);
    this.name = 'InvalidEntityPropertyValueException';
    this.resource = resource;
  }
}

export class UnexpectedRepositoryException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MongoDBAdapterCustomException';
  }
}