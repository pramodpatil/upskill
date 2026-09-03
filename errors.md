# Errors

> What I got wrong, why, and the correct mental model.
> **Not** a list of solutions — a list of my own failure patterns.
> Reread this before every LeetCode session. It should stay short and get sharper.

**Format:** what I wrote → why it's wrong → the rule I should have applied.

---

# Day 1 — 2026-09-03

## Algorithmic

### E1. Carried `length - 1` from brute force into the single pass
```ts
for (let i = 0; i < nums.length - 1; i++)   // wrong in the hash map version
```
Correct in the brute force — the inner loop needed at least one element after `i`.
Wrong in the single pass, because the match is detected when standing on the
**second** element of the pair, so the last index must be visited.

Failed on `nums = [2,7,11,15], target = 26` → returned `[]` instead of `[2,3]`.

> **Rule:** don't copy a loop bound between approaches. Ask each time: *which
> element am I standing on when the answer is found?*

---

### E2. Used `Map` where `Set` was the fit
```ts
const duplicate = new Map<number, number>();
duplicate.set(nums[i], i);   // the index is never read
```
Only `has()` was ever called. The value half was dead weight.

> **Rule:** `Map` when you need the associated data back. `Set` when you only
> need membership. Storing values you never read signals you didn't think about
> what the structure is for.

---

### E3. Added `sort()` on top of the hash map instead of instead of it
```ts
nums.sort();                 // does nothing for a Set-based scan
const duplicate = new Map(); // order is irrelevant to has()
```
The sort was pure cost — and at O(n log n) it became the **dominant term**,
silently downgrading an O(n) solution.

> **Rule:** before adding an operation, ask what it buys. If the answer is
> nothing, it's not neutral — it's the new bottleneck.

---

### E4. Didn't state complexity until asked (×3)
Asked on every submission, supplied on none.

> **Rule:** say it *before* sending. Two questions:
> *How many times does the loop body run?* → time.
> *How big can the thing I created get?* → space.
> Unprompted is a seniority signal; being asked is a mild ding.

---

## TypeScript

### E5. `==` instead of `===` (flagged twice)
`==` coerces types: `"6" == 6` is `true`.

> **Rule:** `===` always. No exceptions worth remembering.

---

### E6. `let` where `const` belongs (flagged twice)
```ts
let need = target - nums[i];   // never reassigned
```
> **Rule:** `const` by default, `let` only when actually reassigning. Also
> preserves literal types, which matters later.

---

### E7. Unnecessary `as number[]`
```ts
return [i, j] as number[];   // already number[] — the assertion does nothing
```
Worse than redundant: assertions are how you *silence* the compiler. Reaching
for `as` when there's no error trains a reflex that eventually hides a real bug.

> **Rule:** only assert when you genuinely know more than the compiler. Almost never.

---

### E8. Missing return on the no-match path
Signature promised `number[]`; function fell off the end returning `undefined`.

> **Rule:** if the return type doesn't include `undefined`, every path returns.

---

### E9. Assumed `has()` narrows `get()`
```ts
if (seen.has(need)) {
    return [seen.get(need), i];   // still number | undefined
}
```
Two independent calls. TypeScript doesn't track the relationship between them.

> **Rule:** call `get` once into a variable, test *that variable* against
> `undefined`. Narrowing works on the value you tested, not a related expression.

---

# The meta-pattern (the one that actually matters)

Across four submissions I fixed the bug that broke the output and left the ones
that didn't — `==`, `let`, `as`, the `has`/`get` narrowing, each flagged twice.

LeetCode's green checkmark only rewards correctness, so nothing pushed back.
But interviews aren't graded by a test runner. Someone reads the code and forms
a judgment. *"I told you about this last time"* is the comment that costs offers.

> **Habit:** before pasting anything, reread the previous feedback and check
> every point off. Thirty seconds. Same discipline as a code review at work.

---

<!-- Next entry below. Keep it short — if this file gets long, the errors aren't being fixed. -->