export class BadRequestCustomException extends Error {
  errors: Map<string, boolean>;
  constructor(message: string, errors: Map<string, boolean>) {
    super(message);
    this.name = 'BadRequestCustomException';
    this.errors = errors;
  }
}
