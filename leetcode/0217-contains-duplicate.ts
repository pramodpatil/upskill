/**
 * 217. Contains Duplicate — Easy
 * https://leetcode.com/problems/contains-duplicate/
 *
 * Pattern: Set for O(1) membership
 *
 * Return true if any value appears at least twice, false if all distinct.
 */

// ─────────────────────────────────────────────────────────────
// Approach 1 — Set (preferred)
// Time: O(n)    Space: O(n)
//
// Set, not Map: you only need to know WHETHER a value was seen, never where.
// A Map here stores index values you never read — dead weight.
//
//   Map → when you need the associated data back
//   Set → when you only need membership
//
// for...of instead of an index loop, since the index is unused.
// ─────────────────────────────────────────────────────────────

function containsDuplicate(nums: number[]): boolean {
    const seen = new Set<number>();

    for (const num of nums) {
        if (seen.has(num)) return true;   // guard and continue — no else needed
        seen.add(num);
    }

    return false;
}

// ─────────────────────────────────────────────────────────────
// Approach 2 — sort and scan adjacent pairs
// Time: O(n log n)   Space: O(n) for the copy, O(1) if mutation is allowed
//
// Once sorted, duplicates sit next to each other, so one adjacent-pair
// scan finds them.
//
// Two traps in Array.prototype.sort():
//   1. Default sort converts to STRINGS and sorts lexicographically:
//        [10, 9, 100, 1].sort()                → [1, 10, 100, 9]
//        [10, 9, 100, 1].sort((a, b) => a - b) → [1, 9, 10, 100]
//      Always pass a comparator for numbers.
//   2. It MUTATES in place. Spread (or .toSorted()) to protect the caller.
//
// Note: adding sort() on top of the Set approach does nothing except make it
// slower — the map doesn't care about order, and O(n log n) then dominates
// the O(n) loop. Sort INSTEAD of the Set, never alongside it.
// ─────────────────────────────────────────────────────────────

function containsDuplicateSorted(nums: number[]): boolean {
    const sorted = [...nums].sort((a, b) => a - b);

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === sorted[i - 1]) return true;
    }

    return false;
}

// ─────────────────────────────────────────────────────────────
// Trade-off — NOT a clean one
//
//               Time          Space
//   Set         O(n)          O(n)
//   Sort        O(n log n)    O(1) if mutation allowed
//
// The Set is faster AND uses more memory. Neither dominates.
//
// "I'd pick the Set — n beats n log n and hash lookups are cheap. I'd switch
//  to sorting if memory were constrained, if the input were already sorted,
//  or if mutating the caller's array were acceptable."
//
// This is the interview point: not "I traded space for time" as a reflex,
// but naming what each option costs and why you'd pick one given constraints.
// ─────────────────────────────────────────────────────────────

console.log(containsDuplicate([1, 2, 3, 1]));   // true
console.log(containsDuplicate([1, 2, 3, 4]));   // false
console.log(containsDuplicate([3, 3]));         // true
console.log(containsDuplicate([]));             // false
export { containsDuplicate, containsDuplicateSorted };
