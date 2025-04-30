export class ResourceNotFoundException extends Error {
  resource: string;
  constructor(message: string, resource: string) {
    super(message);
    this.name = 'ResourceNotFoundException';
    this.resource = resource;
  }
}
