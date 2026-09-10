/**
 * Literal Types and Type Widening
 *
 * Key rule:
 *   `let`   → TypeScript assumes the value can change → widens to the general type.
 *   `const` → TypeScript knows it cannot change     → keeps the literal.
 */

// ─────────────────────────────────────────────────────────────
// 1. Literal Types
//
// A literal type is a type that is exactly one value, not a category.
//   `string` means any string.
//   `"active"` means only "active".
// ─────────────────────────────────────────────────────────────

let status: "active" = "active";   // type: "active", not string
let code: 200 = 200;               // type: 200, not number

function setDirection(dir: "left" | "right") {
    console.log(dir);
}

setDirection("left");              // ✓ literal passed directly — stays narrow
setDirection("up");                // ✗ "up" is not in the union

// ─────────────────────────────────────────────────────────────
// 2. Type Widening
//
// `let`   → value could be reassigned → TypeScript widens at declaration.
// `const` → value can never change    → TypeScript keeps the literal.
//
// Widening happens at the point of declaration, not at the call site.
// By the time setDirection(dir) runs, TypeScript already decided dir is `string`.
// ─────────────────────────────────────────────────────────────

let dir = "left";       // type: string  ← widened
const dir2 = "left";   // type: "left"  ← literal

setDirection(dir);     // ✗ string is not assignable to "left" | "right"
setDirection(dir2);    // ✓ "left" fits
setDirection("left");  // ✓ literal passed directly — TypeScript treats it as "left"

// Why does passing "left" directly work but `dir` doesn't?
// A hardcoded string in a call can never change — TypeScript keeps it narrow.
// `dir` is a variable that could be reassigned — TypeScript widened it at declaration.
// TypeScript works on types, not values.

// ─────────────────────────────────────────────────────────────
// 3. Objects always widen — even with const
//
// `const` only prevents rebinding the variable.
// Object properties can still be reassigned, so they widen.
// ─────────────────────────────────────────────────────────────

const config = {
    theme: "dark",    // type: string ← widened, not "dark"
    fontSize: 16      // type: number ← widened, not 16
};

function applyTheme(theme: "light" | "dark" | "system") {
    document.body.setAttribute("data-theme", theme);
}

applyTheme(config.theme);   // ✗ string is not assignable to "light" | "dark" | "system"

// Fix 1 — as const: freezes every property as a literal + readonly
const config2 = { theme: "dark", fontSize: 16 } as const;
// type: { readonly theme: "dark"; readonly fontSize: 16 }
applyTheme(config2.theme);   // ✓

// Fix 2 — annotate the property type explicitly
// Use this when you want the full union on the property, not just one literal.
// Documents the allowed values right on the config object.
const config3: { theme: "light" | "dark" | "system"; fontSize: number } = {
    theme: "dark",
    fontSize: 16
};
applyTheme(config3.theme);   // ✓

// ─────────────────────────────────────────────────────────────
// 4. Real example — API response
//
// res.json() returns `any`. TypeScript has no idea what shape it is.
// You must declare the shape you expect. TypeScript only checks
// what you declared — extra fields in the response are ignored.
// ─────────────────────────────────────────────────────────────

type ApiResponse = {
    status: "loading" | "success" | "error";
    // add other fields you actually use
};

async function example() {
    const res = await fetch("/api/data");
    const data = await res.json() as ApiResponse;

    // data.status is now "loading" | "success" | "error"
    // data.user → ✗ TypeScript error, not declared in the type
    handleResponse(data.status);   // ✓
}

function handleResponse(status: "loading" | "success" | "error") {
    if (status === "loading") console.log("spinner...");
    if (status === "success") console.log("show data");
    if (status === "error")   console.log("show error");
}

// Safest fix — type guard validates the value at runtime too,
// not just at compile time. `as ApiResponse` is a promise to TypeScript;
// a type guard actually checks.
const STATUSES = ["loading", "success", "error"] as const;
type Status = typeof STATUSES[number];   // "loading" | "success" | "error"

async function safeFetch() {
    const res = await fetch("/api/data");
    const data = await res.json();

    if (STATUSES.includes(data.status)) {
        handleResponse(data.status as Status);   // ✓ runtime + compile time safe
    }
}

// ─────────────────────────────────────────────────────────────
// Summary
//
// | Declaration                         | Type of value        |
// |-------------------------------------|----------------------|
// | const x = "left"                   | "left"               |
// | let x = "left"                      | string               |
// | const obj = { x: "left" }          | { x: string }        |
// | const obj = { x: "left" } as const | { readonly x: "left" } |
//
// TypeScript widens whenever a value could be reassigned.
// `const` stops widening for primitives.
// `as const` stops widening for objects and arrays too.
// ─────────────────────────────────────────────────────────────
