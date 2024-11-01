import { InsufficientFundsError } from "../exceptions/InsufficientFundsError";
import { AccountLockedError } from "../exceptions/AccountLockedError";

/**
 * Represents a bank customer with basic banking operations.
 */
export class Customer {
  private _balance: number;
  private _isLocked: boolean = false;
  private static readonly LOCK_RETRY_INTERVAL = 10; // milliseconds
  private static readonly DEFAULT_LOCK_TIMEOUT = 500; // milliseconds

  /**
   * Creates a new Customer instance.
   * @param _name - The name of the customer.
   * @param initialDeposit - The initial deposit amount.
   * @throws Error if the initial deposit is negative.
   */
  constructor(private _name: string, initialDeposit: number) {
    if (initialDeposit < 0) {
      throw new Error("Initial deposit cannot be negative");
    }
    this._balance = initialDeposit;
  }

  /**
   * Gets the customer's name.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Gets the customer's current balance.
   */
  get balance(): number {
    return this._balance;
  }

  /**
   * Acquires a lock on the customer's account to ensure atomic operations.
   * @param timeout - The maximum time to wait for the lock in milliseconds.
   * @throws AccountLockedError if the lock cannot be acquired within the timeout.
   */
  private async lock(timeout = Customer.DEFAULT_LOCK_TIMEOUT): Promise<void> {
    const startTime = Date.now();
    while (this._isLocked) {
      if (Date.now() - startTime >= timeout) {
        throw new AccountLockedError();
      }
      await new Promise((resolve) =>
        setTimeout(resolve, Customer.LOCK_RETRY_INTERVAL)
      );
    }
    this._isLocked = true;
  }

  /**
   * Releases the lock on the customer's account.
   */
  private unlock(): void {
    this._isLocked = false;
  }

  /**
   * Deposits a specified amount into the customer's account.
   * @param amount - The amount to deposit.
   * @throws Error if the deposit amount is not positive.
   */
  async deposit(amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    await this.lock();
    try {
      // Simulate asynchronous operation
      await new Promise((resolve) => setTimeout(resolve, 10));
      this._balance += amount;
    } finally {
      this.unlock();
    }
  }

  /**
   * Withdraws a specified amount from the customer's account.
   * @param amount - The amount to withdraw.
   * @throws Error if the withdrawal amount is not positive.
   * @throws InsufficientFundsError if the balance is insufficient.
   */
  async withdraw(amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }
    await this.lock();
    try {
      // Simulate asynchronous operation
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (this._balance < amount) {
        throw new InsufficientFundsError();
      }
      this._balance -= amount;
    } finally {
      this.unlock();
    }
  }

  /**
   * Transfers a specified amount from this customer's account to another customer's account.
   * @param amount - The amount to transfer.
   * @param recipient - The recipient customer.
   * @throws Error if attempting to transfer to self.
   * @throws InsufficientFundsError if the balance is insufficient.
   */
  async transfer(amount: number, recipient: Customer): Promise<void> {
    if (recipient === this) {
      throw new Error("Cannot transfer to the same customer");
    }

    // Lock both accounts to prevent race conditions
    const accounts = [this, recipient].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Acquire locks on both accounts
    await Promise.all(accounts.map((account) => account.lock()));

    try {
      // Simulate asynchronous operation
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (this._balance < amount) {
        throw new InsufficientFundsError();
      }
      this._balance -= amount;
      recipient._balance += amount;
    } finally {
      // Release locks
      accounts.forEach((account) => account.unlock());
    }
  }
}
