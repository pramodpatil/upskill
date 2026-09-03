# Patterns

> Pattern names and the reasoning that unlocks them. **Not solutions.**
> If you can re-derive the code from the note, the note is good enough.

---

## 1. Hash map / Set for O(1) lookup

**Signal:** a nested loop is asking *"have I seen this before?"*

**Move:** store what you've seen, look it up instead of scanning.

**The reframe (Two Sum):**
- ✗ "Does any other element pair with this one?" → forces a scan
- ✓ "I need exactly `target - nums[i]` — have I seen it?" → one lookup

**Rules:**
- **Key = what you search by.** Look up by value, want the index back → `value → index`. Reversed means scanning.
- **Check before insert.** Otherwise `[3,3]` matches itself.
- **`Map`** when you need the associated data back. **`Set`** when you only need membership.

**Cost:** O(n) time, O(n) space.

**Problems:** #1 Two Sum, #217 Contains Duplicate

---

<!-- Add the next pattern here. One entry per pattern, not per problem. -->

---

# Complexity cheat sheet

`n` = input size. `O(...)` = "grows roughly like."

| Code shape | Time |
|---|---|
| Direct lookup, no loop | O(1) |
| One loop over input | O(n) |
| Sorting | O(n log n) |
| Loop inside a loop | O(n²) |

- Nested loops **multiply**. Sequential loops **add**, then drop the smaller.
- Drop constants: `n²/2` → O(n²), `3n + 7` → O(n)
- Space = what **you** create. Input doesn't count. Few counters → O(1). Map/Set/array → O(n).
- **Test:** double the input. Work doubles → O(n). Quadruples → O(n²).
- **Trap:** `arr.includes(x)` inside a loop is a hidden inner loop → O(n²).

**Say complexity before being asked.** Unprompted is a seniority signal.

---

# Language notes

## Map
```ts
const map = new Map<number, string>();
map.set(7, "seven");   map.get(7);   map.has(7);   map.size;
```
- `Map` over `{}`: object keys coerce to strings, so `obj[7]` and `obj["7"]` collide.
- **`get()` returns `V | undefined`. `has()` does NOT narrow `get()`** — separate calls, TypeScript doesn't link them. Call `get` once, test the result:
```ts
const j = seen.get(need);
if (j !== undefined) return [j, i];   // j is number here
```

## Set
```ts
const seen = new Set<number>();
seen.add(5);   seen.has(5);   seen.delete(5);   seen.size;
```

## sort()
```ts
[10, 9, 100, 1].sort()                  // [1, 10, 100, 9]  ← string sort!
[10, 9, 100, 1].sort((a, b) => a - b)   // [1, 9, 10, 100]
```
- Default converts to strings. Always pass a comparator for numbers.
- **Mutates in place.** Use `[...nums].sort()` or `.toSorted()`.
- Costs O(n log n) — dominates any O(n) loop attached to it.

## Loop bounds
- `i < length` — the default
- `i <= length` — off-by-one, reads `undefined`
- `i < length - 1` — **only** when you need an element *after* `i` (brute-force inner loop). Wrong for a single pass.
- Inner loop from `i + 1`: prevents self-pairing, checks each pair once.

---

# TypeScript habits

| Rule | Why |
|---|---|
| `===` not `==` | `==` coerces: `"6" == 6` is `true` |
| `const` by default | `let` only when reassigning. Also preserves literal types |
| Avoid `as` | Assertions silence the compiler. `[i, j]` is already `number[]` |
| Type the signature | No `any` |
| Every path returns | Promised `number[]` → return `[]` on the no-match path |
| Guard and continue | `if (x) return true;` then continue — no `else` when the branch returns |

---

# Trade-off framing

**Clean trade (Two Sum):**

| | Time | Space |
|---|---|---|
| Brute force | O(n²) | O(1) |
| Hash map | O(n) | O(n) |

**Not a clean trade (Contains Duplicate):**

| | Time | Space |
|---|---|---|
| Set | O(n) | O(n) |
| Sort + scan | O(n log n) | O(1) if mutation allowed |

Set is faster *and* uses more memory. No winner — depends which resource is scarce.

**The interview point:** not "I traded space for time" as a reflex, but naming what each option costs and why you'd pick one *given the constraints*.

Two sentences to have ready:

> "Brute force is O(n²) time, O(1) space. The hash map is O(n) time, O(n) space. I traded memory for speed, which is right here because n can be 10⁴."

> "The Set is O(n) time but O(n) space. Sorting is O(n log n) time but O(1) space if I can mutate. I'd pick the Set unless memory is constrained."