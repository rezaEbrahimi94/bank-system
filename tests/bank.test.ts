// tests/bank.test.ts

import { Bank } from "../src/models/Bank";
import { DuplicateCustomerError } from "../src/exceptions/DuplicateCustomerError";
import { CustomerNotFoundError } from "../src/exceptions/CustomerNotFoundError";
import { InsufficientFundsError } from "../src/exceptions/InsufficientFundsError";
import { AccountLockedError } from "../src/exceptions/AccountLockedError";

describe("Bank Class Tests", () => {
  let bank: Bank;

  beforeEach(() => {
    bank = new Bank();
  });

  test("Add customer successfully", () => {
    const customer = bank.addCustomer("Alice", 1000);
    expect(customer.name).toBe("Alice");
    expect(customer.balance).toBe(1000);
  });

  test("Add duplicate customer should throw DuplicateCustomerError", () => {
    bank.addCustomer("Charlie", 500);
    expect(() => bank.addCustomer("Charlie", 700)).toThrow(
      DuplicateCustomerError
    );
  });

  test("Get existing customer", () => {
    bank.addCustomer("Dave", 800);
    const customer = bank.getCustomer("Dave");
    expect(customer.name).toBe("Dave");
    expect(customer.balance).toBe(800);
  });

  test("Get non-existent customer should throw CustomerNotFoundError", () => {
    expect(() => bank.getCustomer("Eve")).toThrow(CustomerNotFoundError);
  });

  test("Calculate total bank balance", async () => {
    bank.addCustomer("Alice", 1000);
    bank.addCustomer("Bob", 500);
    bank.addCustomer("Charlie", 1500);
    const total = await bank.getTotalBalance();
    expect(total).toBe(3000);
  });

  test("Transfer funds between customers through Bank", async () => {
    bank.addCustomer("Alice", 1000);
    bank.addCustomer("Bob", 500);
    await bank.transferFunds("Alice", "Bob", 200);
    const alice = bank.getCustomer("Alice");
    const bob = bank.getCustomer("Bob");
    expect(alice.balance).toBe(800);
    expect(bob.balance).toBe(700);
    const total = await bank.getTotalBalance();
    expect(total).toBe(1500);
  });

  test("Transfer funds from non-existent customer should throw CustomerNotFoundError", async () => {
    bank.addCustomer("Bob", 500);
    await expect(bank.transferFunds("NonExistent", "Bob", 100)).rejects.toThrow(
      CustomerNotFoundError
    );
  });

  test("Transfer funds to non-existent customer should throw CustomerNotFoundError", async () => {
    bank.addCustomer("Alice", 1000);
    await expect(
      bank.transferFunds("Alice", "NonExistent", 100)
    ).rejects.toThrow(CustomerNotFoundError);
  });

  test("Transfer funds exceeding balance should throw InsufficientFundsError", async () => {
    bank.addCustomer("Alice", 1000);
    bank.addCustomer("Bob", 500);
    await expect(bank.transferFunds("Alice", "Bob", 1500)).rejects.toThrow(
      InsufficientFundsError
    );
  });

  test("Attempting transfer when account is locked should throw AccountLockedError", async () => {
    bank.addCustomer("Alice", 1000);
    bank.addCustomer("Bob", 500);

    const alice = bank.getCustomer("Alice");
    // Manually lock Alice's account
    (alice as any)._isLocked = true;

    await expect(bank.transferFunds("Alice", "Bob", 100)).rejects.toThrow(
      AccountLockedError
    );
  });
});
