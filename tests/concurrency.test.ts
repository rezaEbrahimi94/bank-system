// tests/concurrency.test.ts

import { Customer } from "../src/models/Customer";
import { AccountLockedError } from "../src/exceptions/AccountLockedError";

describe("Concurrent Transactions Tests", () => {
  test("Simultaneous deposits increase balance correctly", async () => {
    const customer = new Customer("Concurrent User", 1000);

    await Promise.all([
      customer.deposit(500),
      customer.deposit(300),
      customer.deposit(200),
    ]);

    expect(customer.balance).toBe(2000);
  });

  test("Simultaneous withdrawals decrease balance correctly", async () => {
    const customer = new Customer("Concurrent User", 1000);

    await Promise.all([
      customer.withdraw(200),
      customer.withdraw(300),
      customer.withdraw(100),
    ]);

    expect(customer.balance).toBe(400);
  });

  test("Simultaneous transfers maintain consistency", async () => {
    const alice = new Customer("Alice", 1000);
    const bob = new Customer("Bob", 1000);
    const charlie = new Customer("Charlie", 1000);

    await Promise.all([
      alice.transfer(200, bob),
      alice.transfer(300, charlie),
      bob.transfer(100, charlie),
    ]);

    expect(alice.balance).toBe(500);
    expect(bob.balance).toBe(1100);
    expect(charlie.balance).toBe(1400);
  });

  test("Simultaneous transactions exceeding balance handle errors correctly", async () => {
    const customer = new Customer("Concurrent User", 500);

    const results = await Promise.allSettled([
      customer.withdraw(300),
      customer.withdraw(300),
      customer.withdraw(300),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(2);
    expect(customer.balance).toBe(200);
  });

  test("Simultaneous operations on locked account throw AccountLockedError", async () => {
    const customer = new Customer("Concurrent User", 1000);

    // Manually lock the account
    (customer as any)._isLocked = true;

    const results = await Promise.allSettled([
      customer.deposit(100),
      customer.withdraw(100),
      customer.deposit(200),
    ]);

    results.forEach((result) => {
      expect(result.status).toBe("rejected");
      if (result.status === "rejected") {
        expect(result.reason).toBeInstanceOf(AccountLockedError);
      }
    });
  });
});
