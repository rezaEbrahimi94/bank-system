# 🏦 Simple Banking System

Welcome to the **Simple Banking System**! This project implements a robust banking application using TypeScript, focusing on concurrency control, atomic transactions, and comprehensive error handling. The codebase simulates essential banking operations, including deposits, withdrawals, and fund transfers, ensuring data integrity and consistent behavior even under concurrent access. 🚀

---

## Overview

This project is a simulation of a simple banking system implemented in TypeScript. It provides basic banking functionalities with an emphasis on:

- **Atomic Operations**: Ensuring that transactions are completed fully or not at all.
- **Concurrency Control**: Handling simultaneous operations safely using a locking mechanism.
- **Robust Error Handling**: Custom exceptions for clear and maintainable error management.

---

## ✨ Features

- **Customer Account Management**: Create and manage customer accounts with unique names and initial deposits.
- **Deposits and Withdrawals**: Perform deposits and withdrawals with proper validation.
- **Fund Transfers**: Transfer funds between customers safely and atomically.
- **Concurrency Support**: Handle concurrent transactions without data corruption.
- **Custom Error Handling**: Clear and specific exceptions for different error scenarios.
- **Comprehensive Testing**: Jest test suites covering all functionalities.

---

## ⚙️ Design Choices

### 1. Atomic Operations & Concurrency Control 🔒

- **Locking Mechanism**: Each customer account uses a lock to ensure that only one operation can modify the account at a time.
- **Timeouts**: Locks have a timeout to prevent deadlocks and ensure system responsiveness.
- **Consistent Lock Ordering**: Prevents deadlocks during fund transfers by locking accounts in a consistent order.

### 2. Custom Exception Handling ❗

- **AccountLockedError**: Thrown when an operation cannot acquire a lock on an account within the timeout.
- **InsufficientFundsError**: Thrown when an account lacks sufficient balance for a withdrawal or transfer.
- **DuplicateCustomerError**: Thrown when attempting to add a customer that already exists.
- **CustomerNotFoundError**: Thrown when a requested customer does not exist in the bank's records.

### 3. Modular Design 🧩

- Separation of concerns with distinct classes for `Customer`, `Bank`, and custom exceptions.
- Organized codebase for scalability and ease of maintenance.

---

## 🛠️ Getting Started
- clone or download the repository and then run the following



   ```bash
    npm install
    npm test

