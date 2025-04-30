export class BusinessRuleViolationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationException';
  }
}

export class ResourceNotFoundException extends Error {
  resource: string;
  constructor(message: string, resource: string) {
    super(message);
    this.name = 'ResourceNotFoundException';
    this.resource = resource;
  }
}
