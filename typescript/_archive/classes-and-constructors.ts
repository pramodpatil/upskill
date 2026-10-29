/**
 * Classes and Constructors
 *
 * A class is a blueprint for creating objects.
 * A constructor is the function that runs when you create one with `new`.
 */

// ─────────────────────────────────────────────────────────────
// 1. Basic class and constructor
// ─────────────────────────────────────────────────────────────

class Person {
    name: string;   // property declared on the class
    age: number;

    constructor(name: string, age: number) {
        // `this` refers to the object being created
        this.name = name;
        this.age = age;
    }

    greet() {
        return `Hi, I'm ${this.name}`;
    }
}

const p = new Person("Pramod", 30);
console.log(p.name);     // "Pramod"
console.log(p.greet());  // "Hi, I'm Pramod"

// ─────────────────────────────────────────────────────────────
// 2. Constructor parameter shorthand — public / private / protected / readonly
//
// Writing `public name: string` in the constructor parameter is shorthand.
// TypeScript automatically:
//   1. Declares the property on the class
//   2. Assigns the value from the constructor argument
//
// Without shorthand (verbose):
//   name: string;
//   constructor(name: string) { this.name = name; }
//
// With shorthand (same result, less code):
//   constructor(public name: string) {}
// ─────────────────────────────────────────────────────────────

class PersonShort {
    constructor(
        public name: string,      // accessible anywhere
        private age: number,      // only accessible inside this class
        protected role: string,   // accessible inside this class + subclasses
        readonly id: number       // accessible anywhere, but cannot be changed after creation
    ) {}
}

const ps = new PersonShort("Pramod", 30, "admin", 1);

console.log(ps.name);   // ✓ public
console.log(ps.age);    // ✗ TypeScript error — private, only accessible inside PersonShort
console.log(ps.role);   // ✗ TypeScript error — protected, only inside class or subclass
console.log(ps.id);     // ✓ readonly — can read, cannot write
ps.id = 2;              // ✗ TypeScript error — cannot assign to readonly

// ─────────────────────────────────────────────────────────────
// 3. Without the keyword — just a local parameter
//
// If you do NOT add public/private/protected/readonly,
// the parameter is just a local variable inside the constructor.
// It is NOT stored on the object.
// ─────────────────────────────────────────────────────────────

class Example {
    constructor(
        public code: string,   // stored on the object → this.code exists
        message: string        // NOT stored → disappears after constructor runs
    ) {}
}

const ex = new Example("ERR_001", "Something went wrong");
console.log(ex.code);      // ✓ "ERR_001"
console.log(ex.message);   // ✗ TypeScript error — message was never stored

// This is exactly what AppError does:
//   constructor(public code: string, message: string)
//   code   → stored on the error object, accessible as error.code
//   message → passed to super(), stored by the built-in Error class as error.message

// ─────────────────────────────────────────────────────────────
// 4. The four access modifiers — when to use each
//
// public    → default. Anyone can read and write.
// private   → only this class. Hides internal implementation.
// protected → this class + subclasses. Used when extending.
// readonly  → anyone can read, no one can write after construction.
// ─────────────────────────────────────────────────────────────

class BankAccount {
    readonly id: string;           // set once, never changes
    public owner: string;          // anyone can see who owns it
    private balance: number;       // only BankAccount methods can touch this
    protected accountType: string; // subclasses like SavingsAccount can use this

    constructor(id: string, owner: string, initialBalance: number) {
        this.id = id;
        this.owner = owner;
        this.balance = initialBalance;
        this.accountType = "current";
    }

    // balance is private — outside code can only read it through this method
    getBalance(): number {
        return this.balance;
    }

    deposit(amount: number): void {
        this.balance += amount;   // ✓ private — but we're inside the class
    }
}

const account = new BankAccount("ACC001", "Pramod", 1000);
console.log(account.owner);        // ✓ public
console.log(account.getBalance()); // ✓ 1000 — through the public method
account.balance = 99999;           // ✗ private — TypeScript error

// ─────────────────────────────────────────────────────────────
// 5. Inheritance — super()
//
// `extends` creates a subclass that inherits everything from the parent.
// `super()` calls the parent's constructor — required before using `this`.
// ─────────────────────────────────────────────────────────────

class SavingsAccount extends BankAccount {
    constructor(id: string, owner: string, initialBalance: number) {
        super(id, owner, initialBalance);  // must call parent constructor first
        this.accountType = "savings";      // ✓ protected — accessible in subclass
    }

    getAccountType(): string {
        return this.accountType;   // ✓ protected property from parent
    }
}

const savings = new SavingsAccount("SAV001", "Pramod", 5000);
console.log(savings.getAccountType());  // "savings"
console.log(savings.getBalance());      // 5000 — inherited from BankAccount

// ─────────────────────────────────────────────────────────────
// Summary
//
// | Keyword    | Shorthand in constructor? | Who can access?              |
// |------------|--------------------------|------------------------------|
// | public     | ✓ yes                    | Anyone                       |
// | private    | ✓ yes                    | Only this class              |
// | protected  | ✓ yes                    | This class + subclasses      |
// | readonly   | ✓ yes                    | Anyone (read only)           |
// | (none)     | —                        | Local variable, not stored   |
//
// `super(args)` → calls the parent class constructor. Must come first.
// `this`        → refers to the current object instance.
// ─────────────────────────────────────────────────────────────

export { Person, BankAccount, SavingsAccount };
