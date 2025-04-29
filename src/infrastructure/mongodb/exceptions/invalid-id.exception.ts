export class InvalidIdCustomException extends Error {
  resource: string;
  constructor(message: string, resource: string) {
    super(message);
    this.name = 'InvalidIdCustomException';
    this.resource = resource;
  }
}
