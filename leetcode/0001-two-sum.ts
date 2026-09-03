/**
 * 1. Two Sum — Easy
 * https://leetcode.com/problems/two-sum/
 *
 * Pattern: hash map for O(1) lookup
 *
 * Given nums and target, return the indices of the two numbers adding to target.
 * Exactly one valid answer. Cannot use the same element twice.
 */

// ─────────────────────────────────────────────────────────────
// Approach 1 — brute force
// Time: O(n²)   Space: O(1)
//
// Check every pair. j starts at i + 1 so an element is never paired
// with itself, and each pair is checked exactly once.
// ─────────────────────────────────────────────────────────────

function twoSumBruteForce(nums: number[], target: number): number[] {
    for (let i = 0; i < nums.length - 1; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (target === nums[i] + nums[j]) {
                return [i, j];
            }
        }
    }
    return [];
}

// ─────────────────────────────────────────────────────────────
// Approach 2 — hash map (preferred)
// Time: O(n)    Space: O(n)
//
// The reframe:
//   ✗ "Does any other element pair with this one?"  → forces a scan
//   ✓ "I need exactly target - nums[i]. Have I seen it?" → one lookup
//
// Key = the number (what you search by), value = its index (what you want back).
// Reversed, you'd have to scan every entry to find the value — O(n) again.
//
// Check BEFORE insert: the map then only holds elements strictly before i,
// so an element can never match itself.  [3, 3] target 6:
//   insert-first  → i=0 finds itself       → [0, 0]  WRONG
//   check-first   → i=0 miss, i=1 hits 0   → [0, 1]  correct
//
// Loop bound is `i < nums.length`, NOT `length - 1`. The pair completes when
// you stand on the SECOND element, so the last index must be visited.
// ─────────────────────────────────────────────────────────────

function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();   // number → index

    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        const j = seen.get(need);

        // get() returns `number | undefined`, and has() does NOT narrow get()
        // — separate calls, TypeScript doesn't link them. Test the result
        // directly so `j` narrows to `number` inside the block.
        if (j !== undefined) {
            return [j, i];
        }

        seen.set(nums[i], i);
    }

    return [];   // signature promises number[], so every path must return one
}

// ─────────────────────────────────────────────────────────────
// Trade-off — a clean one here
//
//   brute force   O(n²) time,  O(1) space
//   hash map      O(n)  time,  O(n) space
//
// "I traded memory for speed, which is right here because n can be 10⁴ —
//  n² is a hundred million comparisons."
// ─────────────────────────────────────────────────────────────

// Trace: nums = [2, 7, 11, 15], target = 9
//
//   i   nums[i]   need   seen?           map after
//   0   2         7      no              {2 → 0}
//   1   7         2      yes, index 0    → return [0, 1]

// ── quick tests ──────────────────────────────────────────────
console.log(twoSum([2, 7, 11, 15], 9));    // [0, 1]
console.log(twoSum([3, 2, 4], 6));         // [1, 2]
console.log(twoSum([3, 3], 6));            // [0, 1]
console.log(twoSum([2, 7, 11, 15], 26));   // [2, 3]  ← the case that caught the loop bug

export { twoSum, twoSumBruteForce };
