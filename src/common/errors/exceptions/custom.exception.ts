import { ExceptionTypeKeys } from '../error-code-keys.enum';

export class CustomException extends Error {
  key: string;
  error: string;
  traceId: string;
  timestamp: string;

  /**
   * Creates an instance of CustomException.
   * @param {string} key - The error key.
   * @param {string} name - The name of the exception.
   * @param {any} [error] - The error message or details.
   */
  constructor(key: string, name: string, error?: any) {
    super(name, { cause: error });
    this.name = ExceptionTypeKeys.UNEXPECTED;
    this.key = key;
    this.generateTraceId();
    this.generateTimestamp();
  }

  private generateTraceId() {
    // Generate a unique trace ID for the exception, with length 20 and alphanumeric characters
    const length = 20;
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let traceId = '';
    for (let i = 0; i < length; i++) {
      traceId += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    this.traceId = traceId;
  }

  private generateTimestamp() {
    this.timestamp = new Date().toISOString(); // Generate a timestamp in ISO format
  }
}
