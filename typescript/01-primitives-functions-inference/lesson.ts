// ============================================================
// TypeScript Block 1 — Primitives, Functions, Type Inference
// Run:  npx ts-node typescript/01-primitives-functions-inference/lesson.ts
// ============================================================

// This makes the file a "module". Without it, every top-level name here is
// global, and it would clash with the same name in any other .ts file in the
// project (tsconfig includes **/*.ts).
export {};

// ------------------------------------------------------------
// PART 1 — PRIMITIVES
// ------------------------------------------------------------
// The 7 JavaScript primitives, each with a TS type:
const userName: string = "Pramod";
const age: number = 30;          // ints AND floats: there is no separate int type
const isAdmin: boolean = false;
const nothing: null = null;      // "intentionally empty"
const notSet: undefined = undefined; // "never assigned"
const big: bigint = 9007199254740993n;
const id: symbol = Symbol("id");

// Lowercase only. `String`, `Number`, `Boolean` are wrapper OBJECT types.
// const bad: String = "x";   // works, but wrong habit, never do this

// Four special types you will see constantly:
let anything: any = 5;        // turns type checking OFF. Avoid.
// anything.foo.bar();        // compiles! crashes at runtime. That's the danger.

let input: unknown = JSON.parse('{"a":1}'); // "I don't know yet": safe version of any
// input.a;                   // ❌ error: you must CHECK before you use it
if (typeof input === "object" && input !== null && "a" in input) {
  console.log("unknown, after narrowing:", input.a);
}

function log(msg: string): void {      // void = returns nothing useful
  console.log(msg);
}
function fail(msg: string): never {    // never = never returns at all (throws / infinite loop)
  throw new Error(msg);
}

// ------------------------------------------------------------
// PART 2 — TYPE INFERENCE
// ------------------------------------------------------------
// TS figures out types from the value. You don't need to annotate everything.
let city = "Pune";         // inferred: string
const country = "India";   // inferred: "India"  (literal type! const can't change)
let count = 0;             // inferred: number
// count = "zero";         // ❌ Type 'string' is not assignable to type 'number'

// let vs const = "widening":
//   let  → TS widens to the general type (string) because you might reassign
//   const → TS keeps the exact literal ("India") because you can't
type Direction = "up" | "down";
const d = "up";            // "up"   → assignable to Direction ✅
let d2 = "up";             // string → NOT assignable to Direction
// const dir: Direction = d2;   // ❌ string is not assignable to Direction

// Empty declarations become `any` silently in some cases — always annotate these:
let later: string;         // ✅ annotate when there's no initial value
later = "set afterwards";

// RULE OF THUMB
//   Annotate: function parameters, variables with no initial value, public APIs.
//   Let TS infer: local variables with a value, most return types.

// ------------------------------------------------------------
// PART 3 — FUNCTIONS
// ------------------------------------------------------------
// 3a. Parameter types are REQUIRED (TS can't guess them). Return type is inferred.
function add(a: number, b: number) {      // return inferred as number
  return a + b;
}

// 3b. Explicit return type: a contract. If you return the wrong thing, error HERE
//     instead of somewhere far away where the result is used.
function getDiscount(price: number): number {
  return price > 1000 ? price * 0.1 : 0;
}

// 3c. Optional (?) and default parameters
function greet(name: string, greeting?: string) {   // greeting: string | undefined
  return `${greeting ?? "Hello"}, ${name}`;
}
function greet2(name: string, greeting = "Hello") { // type inferred from default
  return `${greeting}, ${name}`;
}
// Optional params must come AFTER required ones.

// 3d. Rest parameters
function sum(...nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0);
}

// 3e. Arrow functions + function TYPES
//     A function type describes the shape: (params) => return
type MathOp = (a: number, b: number) => number;
const multiply: MathOp = (a, b) => a * b;  // a, b inferred from MathOp: "contextual typing"

// 3f. Union params + narrowing (preview of what you'll use daily)
function formatId(id: string | number): string {
  if (typeof id === "number") {
    return id.toFixed(0);    // inside here TS knows id is number
  }
  return id.toUpperCase();   // here TS knows id is string
}

// ------------------------------------------------------------
// PART 4 — WHERE THIS SHOWS UP IN ANGULAR AND EXPRESS
// ------------------------------------------------------------
// Angular 20 (inference does most of the work):
//   count = signal(0);                 // WritableSignal<number>, inferred from 0
//   title = input<string>('');         // signal input, typed explicitly
//   isOpen = false;                    // inferred boolean, no annotation needed
//   close(): void { this.isOpen = false; }   // void return on event handlers
//
// Express (process.env is the classic unknown-ish value):
//   const port = process.env.PORT;     // string | undefined  ← NOT number!
//   const portNum = Number(process.env.PORT ?? 3000);   // number
//   app.get('/users/:id', (req: Request, res: Response): void => {
//     const id = req.params.id;        // string (route params are always strings)
//   });

// ------------------------------------------------------------
// Run it
// ------------------------------------------------------------
log(`${userName}, ${age}, admin=${isAdmin}, ${nothing}, ${notSet}, ${big}, ${id.toString()}`);
log(`city=${city}, country=${country}, count=${count}, d=${d}, d2=${d2}, later=${later}`);
log(`add=${add(2, 3)}, discount=${getDiscount(2000)}, sum=${sum(1, 2, 3)}, multiply=${multiply(4, 5)}`);
log(`${greet("Pramod")} | ${greet("Pramod", "Hi")} | ${greet2("Pramod")}`);
log(`formatId: ${formatId(42.7)} / ${formatId("abc")}`);
try { fail("never returns"); } catch (e) { log(`caught: ${(e as Error).message}`); }
