/**
 * Type Narrowing
 *
 * Narrowing is how TypeScript refines a broad type down to a specific one
 * inside a block. It's the flip side of widening.
 *
 * TypeScript tracks which types are possible at every point in the code.
 * A check — typeof, truthiness, in, discriminant — eliminates variants
 * and narrows what's left.
 */

// ─────────────────────────────────────────────────────────────
// 1. typeof — for primitives
//
// Works for: string, number, boolean, bigint, symbol, undefined, function.
// Does NOT work for objects or arrays — they all return "object".
// ─────────────────────────────────────────────────────────────

function print(value: string | number) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());   // ✓ string here
    } else {
        console.log(value.toFixed(2));      // ✓ number here
    }
}

// ─────────────────────────────────────────────────────────────
// 2. Truthiness narrowing — for null / undefined
//
// null, undefined, 0, "", false are all falsy.
//
// Trap: if 0 is a valid value, a truthiness check wrongly excludes it.
// Use !== null instead when 0 matters.
// ─────────────────────────────────────────────────────────────

function greet(name: string | null) {
    if (name) {
        console.log(name.toUpperCase());   // ✓ null ruled out
    } else {
        console.log("Hello, stranger");
    }
}

function process(count: number | null) {
    if (count !== null) {
        console.log(count.toFixed(2));     // ✓ only null ruled out, 0 is safe
    }
}

// ─────────────────────────────────────────────────────────────
// 3. `in` — for objects with different shapes
//
// Checks if a property exists on the object.
// TypeScript uses that to narrow the union.
// ─────────────────────────────────────────────────────────────

type Cat = { meow: () => void };
type Dog = { bark: () => void };

function makeSound(animal: Cat | Dog) {
    if ("meow" in animal) {
        animal.meow();   // ✓ Cat here
    } else {
        animal.bark();   // ✓ Dog here
    }
}

// ─────────────────────────────────────────────────────────────
// 4. Discriminated unions — the most powerful pattern
//
// Give every type in a union a shared `kind` property with a literal value.
// TypeScript narrows on that literal — once it sees shape.kind === "circle",
// it eliminates every other variant.
//
// You'll see this in Angular (NgRx actions), React (reducers), and
// any API state machine.
// ─────────────────────────────────────────────────────────────

type Shape =
    | { kind: "circle";    radius: number }
    | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius ** 2;
        // shape.radius ✓ — TypeScript knows it exists on this variant
        // shape.width  ✗ — TypeScript error, not on circle
    } else {
        return shape.width * shape.height;
        // shape.width, shape.height ✓
        // shape.radius ✗ — TypeScript error, not on rectangle
    }
}

// ─────────────────────────────────────────────────────────────
// 5. Exhaustiveness checking with never
//
// `never` means "this should never be reached."
// If you add a new variant to the union but forget a case,
// TypeScript errors on the default line — telling you exactly what you missed.
// ─────────────────────────────────────────────────────────────

function areaSafe(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        default:
            const _exhaustive: never = shape;   // ✗ Error if a case is unhandled
            return _exhaustive;
    }
}

// ─────────────────────────────────────────────────────────────
// Real example — API state machine
// ─────────────────────────────────────────────────────────────

type LoadingState = { kind: "loading" };
type SuccessState = { kind: "success"; data: string[] };
type ErrorState   = { kind: "error";   message: string };

type State = LoadingState | SuccessState | ErrorState;

function render(state: State) {
    if (state.kind === "loading") {
        console.log("spinner...");
    } else if (state.kind === "success") {
        console.log(state.data);       // ✓ .data only exists on SuccessState
    } else {
        console.log(state.message);    // ✓ .message only exists on ErrorState
    }
}

// ─────────────────────────────────────────────────────────────
// Summary — narrowing techniques
//
// | Technique              | Use for                          |
// |------------------------|----------------------------------|
// | typeof                 | primitives (string, number, ...) |
// | truthiness / !== null  | null / undefined                 |
// | in                     | objects with different shapes    |
// | discriminated union    | union with a shared kind field   |
// | never (exhaustiveness) | catch unhandled variants         |
//
// TypeScript narrows at the point of the check.
// Inside the block, the type is specific. Outside, it's the full union again.
// ─────────────────────────────────────────────────────────────
