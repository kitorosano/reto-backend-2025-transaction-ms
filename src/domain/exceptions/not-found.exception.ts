export class NotFoundCustomException extends Error {
  resource: string;
  constructor(message: string, resource: string) {
    super(message);
    this.name = 'NotFoundCustomException';
    this.resource = resource;
  }
}
