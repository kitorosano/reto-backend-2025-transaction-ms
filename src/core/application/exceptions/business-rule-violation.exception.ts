export class BusinessRuleViolationException extends Error {
  errors: Map<string, boolean>;
  constructor(message: string, errors: Map<string, boolean>) {
    super(message);
    this.name = 'BusinessRuleViolationException';
    this.errors = errors;
  }
}
