export class ValidationError extends Error {
  public fieldErrors: Record<string, string>;

  constructor(fieldErrors: Record<string, string>) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

  getFieldError(fieldName: string): string | undefined {
    return this.fieldErrors[fieldName];
  }

  hasErrors(): boolean {
    return Object.keys(this.fieldErrors).length > 0;
  }
}