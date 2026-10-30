# Block 1 — Primitives, Functions, Type Inference

Files: `lesson.ts` (concepts) · `exercise.ts` (my answers)

---

## 1. Primitive types

**Rule:** The 7 primitives are `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`. Always lowercase. `String` / `Number` / `Boolean` are wrapper object types — never use them as annotations.

**Interview answer:** "TypeScript mirrors JavaScript's seven primitives. `number` covers integers and floats — there's no separate int type. I always use the lowercase forms, because the capitalised ones refer to wrapper objects."

**In simple words:** Same 7 basic types as JavaScript, written in lowercase.

---

## 2. any vs unknown

**Rule:** `any` turns type checking off. `unknown` means "I don't know yet" — you must narrow it (`typeof`, `in`, `instanceof`) before using it.

**Interview answer:** "Both accept any value, but `unknown` is type-safe: you can't call methods or read properties until you've narrowed it. I use `unknown` for things like `JSON.parse` results, API responses and `catch (e)` errors, and avoid `any` because it hides bugs until runtime."

**In simple words:** `any` = "trust me, don't check." `unknown` = "check before you touch."

**Cross-stack:** Express `req.body` and `JSON.parse` are really unknown data — validate them (Zod, Block 6) before trusting them.

---

## 3. void vs never

**Rule:** `void` = the function finishes but returns nothing useful. `never` = the function never finishes (always throws or loops forever). A function that always throws must be annotated `: never` explicitly — otherwise TS infers `void`.

**Interview answer:** "`void` means the function returns normally with no meaningful value, like an event handler. `never` means control never comes back — it always throws. TypeScript uses `never` for control-flow analysis: after calling a `never` function, it knows the following code only runs in the other branch. `never` is also the empty type, so it disappears from unions: `number | never` is just `number`."

**In simple words:** `void` = you come back empty-handed. `never` = you don't come back at all.

**My mistake:** I annotated `safeDivide(): never | number`. It works, but it's redundant — `never` adds nothing to a union (like `5 + 0`), so the type is just `number`, and TS infers that without annotation.

---

## 4. Type inference and widening (let vs const)

**Rule:** TS infers a type from the initial value. `let` widens to the general type (`string`); `const` keeps the exact literal type (`"India"`), because it can never change.

**Interview answer:** "With `let x = 'up'` the type is widened to `string` because x could be reassigned. With `const x = 'up'` the type is the literal `'up'`. That matters when assigning to a union like `'up' | 'down'` — the `let` version fails. I annotate parameters, variables with no initial value, and public APIs; I let TS infer everything else."

**In simple words:** `let` = "some string." `const` = "exactly this string."

**Predict-the-type (my answers):** `let a = 10` → `number` ✅ · `const b = 10` → `10` ✅ · `let c = [1, "two"]` → `(string | number)[]` (I said `object` ❌ — too vague) · `const e = null` → `null` ✅ · ternary of `"yes"`/`0` → `string | number` ✅

---

## 5. Runtime `typeof` vs TypeScript type  *(my question)*

**Rule:** JavaScript's `typeof` runs at **runtime** and only knows broad categories (`"string"`, `"number"`, `"object"`…). TypeScript types exist only at **compile time** and can be much more precise. Both are right — they answer different questions.

**Interview answer:** "`const country = 'India'` — at runtime `typeof country` is `'string'`. At compile time TS gives it the literal type `'India'`, a subtype of string that allows exactly one value. TS types are erased when compiled to JS, so they never exist at runtime — that's why runtime checks still need `typeof`, and why libraries like Zod exist."

**In simple words:** `string` = "any person." `"India"` = "this one specific person." Every `"India"` is a string, not every string is `"India"`.

**Cross-stack:** Angular: `type ButtonSize = 'sm' | 'md' | 'lg'` for component inputs. Express: `type Method = 'GET' | 'POST'`.

---

## 6. Function parameters

**Rule:** Parameters must be annotated (TS can't guess them). Return types are inferred, but annotate them when the function is a contract. Optional (`?`) and default params must come after required ones. A default value already gives the type: `taxRate = 0.18` is enough, no `: number` needed.

**Interview answer:** "What's the difference between `greeting?: string` and `greeting = 'Hello'`? Inside the function, the optional one is `string | undefined` and you must handle `undefined`; the default one is always `string`. From the caller's side, both can be omitted."

**In simple words:** Type the inputs. Let TS figure out the output unless you want a promise in writing.

**My mistake (Q2):** I multiplied by `taxRate` instead of `(1 + taxRate)` → got 36 instead of 236. TS can't catch logic errors — only type errors.

---

## 7. Function types and contextual typing

**Rule:** `type Validator = (value: string) => boolean` describes a function's shape. When a variable is annotated with that type, the arrow function's parameters are typed automatically — this is **contextual typing**.

**Interview answer:** "I define a function type once and reuse it. `const isEmail: Validator = (email) => email.includes('@')` — `email` is inferred as `string` from the `Validator` type. It keeps every implementation consistent, and TS errors if one returns the wrong type."

**In simple words:** Describe the shape once; every function that uses it gets its types for free.

**Cross-stack:**
- Angular: `const noSpaces: ValidatorFn = (control) => …` — `ValidatorFn` is exactly this pattern.
- Express: `const auth: RequestHandler = (req, res, next) => …` — `req`, `res`, `next` all typed for you.

**My mistake (first attempt Q4):** I typed the parameters by hand (`(email: string) =>`) and never created the `Validator` type.

---

## 8. Parsing strings to numbers  *(from Q3)*

**Rule:** `parseInt("80abc")` → `80` (reads until it hits garbage). `Number("80abc")` → `NaN` (whole string must be valid). `Number("")` → `0`, so check for empty first.

**Interview answer:** "For config like `process.env.PORT`, which is `string | undefined`, I check for undefined, convert with `Number()` (stricter than `parseInt`), and fall back to a default if the result is `NaN`."

**In simple words:** `parseInt` is forgiving, `Number` is strict. For config, strict is safer.

---

## Quick interview round

| Question | Short answer |
|---|---|
| Is there an `int` type in TS? | No — `number` covers both. `bigint` for very large integers. |
| `any` vs `unknown`? | `unknown` forces you to narrow before use; `any` disables checks. |
| `void` vs `never`? | `void` returns with nothing; `never` doesn't return at all. |
| What is `number \| never`? | `number` — `never` is the empty type and vanishes from unions. |
| Why is `const x = "a"` typed `"a"`? | Literal type: `const` can't be reassigned, so TS keeps the exact value. |
| Do TS types exist at runtime? | No — they're erased on compile. Runtime checks need `typeof` / validation. |
| What's contextual typing? | Parameters get their types from the variable's function type. |
| Why `export {}` at the top of a file? | Makes it a module so its names don't clash globally with other files. |
