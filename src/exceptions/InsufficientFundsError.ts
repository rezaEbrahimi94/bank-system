/**
 * Error thrown when an account has insufficient funds for a transaction.
 */
export class InsufficientFundsError extends Error {
  constructor(message: string = "Insufficient funds") {
    super(message);
    Object.setPrototypeOf(this, InsufficientFundsError.prototype);
    this.name = "InsufficientFundsError";
  }
}
