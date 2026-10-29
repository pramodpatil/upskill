# TypeScript — Learning Notes

> Quick-review card. One rule + interview answer + plain words per topic.
> Full code and examples → the linked `.ts` file.

---

## 1. Literal Types & Type Widening
File: `literal-types-and-widening.ts`
Rule: `let` widens to the general type. `const` keeps the literal.

**Interview answer:**
"TypeScript widens `let` variables because they could be reassigned. Use `const` for primitives and `as const` for objects to preserve literal types."

**In simple words:**
When you use `let`, TypeScript thinks — "this value might change, so I'll treat it as the general type." When you use `const`, it thinks — "this will never change, I can be specific." Objects are trickier — even with `const`, the properties can still change, so you need `as const` to lock everything down.

---

## 2. Type Narrowing
File: `type-narrowing.ts`
Rule: A check (`typeof`, `in`, truthiness, discriminant) eliminates variants and narrows the type inside that block.

**Interview answer:**
"Type narrowing is how TypeScript refines a broad union type to a specific one inside a conditional block. I use `typeof` for primitives, `in` for object shapes, and discriminated unions with a shared `kind` field for complex state — which also enables exhaustiveness checking with `never`."

**In simple words:**
When a variable could be multiple types, TypeScript won't let you use type-specific methods until you *prove* which type it is. A simple `if` check does that — inside the block, TypeScript knows exactly what type you're dealing with. The `kind` field trick is the cleanest way to handle this when you have objects with different shapes.

---

<!-- Add the next topic here -->


## 3. Classes & Constructors
File: `classes-and-constructors.ts`
Rule: A keyword before a constructor parameter (`public`/`private`/`protected`/`readonly`) turns it into a stored property automatically. No keyword = local variable only, gone after the constructor finishes.

**Interview answer:**
"TypeScript's constructor parameter shorthand lets you declare and initialise a class property in one place. I use `public` for values callers need, `private` to hide implementation details, `protected` for things subclasses need, and `readonly` for IDs or values that must never change after creation. Without a keyword, the parameter is just a local variable — it isn't stored on the object."

**In simple words:**
Normally you'd write: `this.name = name` in the constructor body. TypeScript lets you skip that boilerplate — add `public` (or another keyword) to the parameter and it does that for you. The key question is always: *does this value live on the object after the constructor?* With a keyword: yes. Without: no. That's exactly why `AppError` writes `public code: string, message: string` — `code` is stored on the error, `message` is just passed up to `super()` and stored there by the built-in `Error` class instead.

---

<!-- Add the next topic here -->
