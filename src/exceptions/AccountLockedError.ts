/**
 * Error thrown when an operation is attempted on a locked account.
 */
export class AccountLockedError extends Error {
  constructor(message: string = "Account is currently locked") {
    super(message);
    Object.setPrototypeOf(this, AccountLockedError.prototype);
    this.name = "AccountLockedError";
  }
}
