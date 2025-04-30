export class BusinessRuleViolationException extends Error {
  errors: Map<string, boolean>;
  constructor(message: string, errors: Map<string, boolean>) {
    super(message);
    this.name = 'BusinessRuleViolationException';
    this.errors = errors;
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
