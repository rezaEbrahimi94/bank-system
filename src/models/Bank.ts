import { Customer } from "./Customer";
import { DuplicateCustomerError } from "../exceptions/DuplicateCustomerError";
import { CustomerNotFoundError } from "../exceptions/CustomerNotFoundError";

/**
 * Represents a bank that manages customers and their transactions.
 */
export class Bank {
  private customers: Map<string, Customer>;

  constructor() {
    this.customers = new Map<string, Customer>();
  }

  /**
   * Adds a new customer to the bank.
   * @param name - The name of the new customer.
   * @param initialDeposit - The initial deposit amount.
   * @returns The newly created Customer object.
   * @throws DuplicateCustomerError if a customer with the same name already exists.
   */
  addCustomer(name: string, initialDeposit: number): Customer {
    if (this.customers.has(name)) {
      throw new DuplicateCustomerError(`Customer '${name}' already exists`);
    }
    const customer = new Customer(name, initialDeposit);
    this.customers.set(name, customer);
    return customer;
  }

  /**
   * Retrieves a customer by name.
   * @param name - The name of the customer.
   * @returns The Customer object.
   * @throws CustomerNotFoundError if the customer does not exist.
   */
  getCustomer(name: string): Customer {
    const customer = this.customers.get(name);
    if (!customer) {
      throw new CustomerNotFoundError(`Customer '${name}' not found`);
    }
    return customer;
  }

  /**
   * Calculates the total balance of all customers in the bank.
   * @returns The total balance.
   */
  async getTotalBalance(): Promise<number> {
    let total = 0;
    for (const customer of this.customers.values()) {
      total += customer.balance;
    }
    return total;
  }

  /**
   * Transfers funds between two customers.
   * @param fromName - The name of the sender.
   * @param toName - The name of the recipient.
   * @param amount - The amount to transfer.
   * @throws CustomerNotFoundError if either customer does not exist.
   */
  async transferFunds(
    fromName: string,
    toName: string,
    amount: number
  ): Promise<void> {
    const fromCustomer = this.getCustomer(fromName);
    const toCustomer = this.getCustomer(toName);
    await fromCustomer.transfer(amount, toCustomer);
  }
}
