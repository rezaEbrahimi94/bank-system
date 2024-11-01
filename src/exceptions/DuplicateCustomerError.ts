/**
 * Error thrown when attempting to add a customer that already exists.
 */
export class DuplicateCustomerError extends Error {
  constructor(message: string = "Customer already exists") {
    super(message);
    Object.setPrototypeOf(this, DuplicateCustomerError.prototype);
    this.name = "DuplicateCustomerError";
  }
}
