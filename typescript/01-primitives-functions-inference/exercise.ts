// ============================================================
// Block 1 Exercise — write your answers below each task
// Run:  npx ts-node typescript/01-primitives-functions-inference/exercise.ts
// Rules: no `any`. Annotate only where you need to (parameters, contracts).
// ============================================================
export {};

// ------------------------------------------------------------
// Q1. PREDICT THE TYPE (write your answer in the comment, don't hover yet)
// ------------------------------------------------------------
let a = 10;               // a: number
const b: number = 10;             // b: 10
let c = [1, "two"];       // c: (number | string)[]
const e = null;           // e: null
let f = Math.random() > 0.5 ? "yes" : 0;   // f: string | number

// ------------------------------------------------------------
// Q2. calculateTotal
// Takes a price (number), a quantity (number) and an OPTIONAL tax rate
// (default 0.18). Returns the total as a number.
//   calculateTotal(100, 2)        → 236
//   calculateTotal(100, 2, 0)     → 200
// ------------------------------------------------------------

function calculateTotal (price: number, quantity: number, taxRate: number = 0.18): number {
    const total: number = price * quantity * (1 + taxRate);
    return total;
}

// ------------------------------------------------------------
// Q3. parsePort
// Takes a value that could be a string OR undefined (like process.env.PORT).
// Returns a number. If undefined or not a valid number, return 3000.
//   parsePort("8080")   → 8080
//   parsePort(undefined) → 3000
//   parsePort("abc")    → 3000
// ------------------------------------------------------------
const parsePort = (port: string | undefined): number => {
    if (!port) return 3000;
    const newPort = Number.parseInt(port);
    return Number.isNaN(newPort) ? 3000 : newPort;
}

// ------------------------------------------------------------
// Q4. Function type
// Create a type `Validator` for a function that takes a string and returns
// a boolean. Then write two validators using it (arrow functions, no
// annotations on the parameters — let the type do it):
//   isEmail    → true if it contains "@"
//   isNotEmpty → true if trimmed length > 0
// ------------------------------------------------------------
type Validator = (value: string) => boolean
const isEmail: Validator = (email) => email.includes('@');
const isNotEmpty: Validator = (str) => str.trim().length > 0;

// ------------------------------------------------------------
// Q5. void vs never
// a) Write `fail(message: string)` that ALWAYS throws an Error.
//    What is its correct return type, and why?
// b) Write `safeDivide(a: number, b: number)` that calls fail("Cannot divide by zero")
//    when b is 0, otherwise returns a / b.
//    What return type does TS infer for safeDivide? Why isn't it `number | never`?
// ------------------------------------------------------------
function fail (message: string): never {
    throw new Error(message)
}

function safeDivide(a: number, b: number) {
    if (b === 0) fail("Can not divide by zero");
    return a/b;
}

// ------------------------------------------------------------
// Uncomment once you're done to check your work:
// ------------------------------------------------------------
console.log(calculateTotal(100, 2), calculateTotal(100, 2, 0));
console.log(parsePort("8080"), parsePort(undefined), parsePort("abc"));
console.log(isEmail("a@b.com"), isEmail("nope"), isNotEmpty("  "), isNotEmpty("hi"));
console.log(safeDivide(10, 2));
