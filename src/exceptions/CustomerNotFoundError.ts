/**
 * Error thrown when a requested customer is not found.
 */
export class CustomerNotFoundError extends Error {
  constructor(message: string = "Customer not found") {
    super(message);
    Object.setPrototypeOf(this, CustomerNotFoundError.prototype);
    this.name = "CustomerNotFoundError";
  }
}
