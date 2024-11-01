// tests/customer.test.ts

import { Customer } from "../src/models/Customer";
import { InsufficientFundsError } from "../src/exceptions/InsufficientFundsError";
import { AccountLockedError } from "../src/exceptions/AccountLockedError";

describe("Customer Class Tests", () => {
  let customer: Customer;

  beforeEach(() => {
    customer = new Customer("Test User", 1000);
  });

  test("Customer creation with valid initial deposit", () => {
    expect(customer.name).toBe("Test User");
    expect(customer.balance).toBe(1000);
  });

  test("Deposit positive amount increases balance", async () => {
    await customer.deposit(500);
    expect(customer.balance).toBe(1500);
  });

  test("Withdraw valid amount decreases balance", async () => {
    await customer.withdraw(300);
    expect(customer.balance).toBe(700);
  });

  test("Withdraw amount exceeding balance should throw InsufficientFundsError", async () => {
    await expect(customer.withdraw(1500)).rejects.toThrow(
      InsufficientFundsError
    );
  });

  test("Transfer funds to another customer", async () => {
    const recipient = new Customer("Recipient User", 500);
    await customer.transfer(200, recipient);
    expect(customer.balance).toBe(800);
    expect(recipient.balance).toBe(700);
  });

  test("Transfer amount exceeding balance should throw InsufficientFundsError", async () => {
    const recipient = new Customer("Recipient User", 500);
    await expect(customer.transfer(1500, recipient)).rejects.toThrow(
      InsufficientFundsError
    );
  });

  test("Cannot transfer to self", async () => {
    await expect(customer.transfer(100, customer)).rejects.toThrow(
      "Cannot transfer to the same customer"
    );
  });

  test("Attempting operation on locked account should throw AccountLockedError", async () => {
    // Manually lock the account
    (customer as any)._isLocked = true;

    await expect(customer.deposit(100)).rejects.toThrow(AccountLockedError);
    await expect(customer.withdraw(100)).rejects.toThrow(AccountLockedError);
  });
});
