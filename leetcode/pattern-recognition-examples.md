/**
 * Pattern Recognition — Worked Examples
 *
 * Format per problem:
 *   1. Problem restatement
 *   2. Keyword signals spotted
 *   3. Brute force shape
 *   4. Bottleneck identified
 *   5. Pattern matched
 *
 * Goal: re-derive the pattern from scratch, not from memory.
 */

// ─────────────────────────────────────────────────────────────
// #1 Two Sum
// https://leetcode.com/problems/two-sum/
// ─────────────────────────────────────────────────────────────

// 1. RESTATE
//    Given an array and a target, return the indices of the two
//    numbers that add up to target.

// 2. KEYWORD SIGNALS
//    "two numbers" + "target" → find a pair → hash map signal
//    "return indices" → need to store index alongside the value

// 3. BRUTE FORCE SHAPE
//    For every element i, scan every element j after it.
//    Ask: do nums[i] + nums[j] === target?
//    → nested loop → O(n²)

// 4. BOTTLENECK
//    The inner loop is asking: "is there a number that pairs with nums[i]?"
//    That's a search. A scan is O(n). We do it n times → O(n²).
//    If we could answer "have I seen (target - nums[i])?" in O(1), the
//    inner loop disappears.

// 5. PATTERN MATCHED
//    Hash map. Store value → index as we walk.
//    At each step, check if the complement is already stored.
//    One pass, one lookup per element → O(n).

// ─────────────────────────────────────────────────────────────
// #217 Contains Duplicate
// https://leetcode.com/problems/contains-duplicate/
// ─────────────────────────────────────────────────────────────

// 1. RESTATE
//    Given an array, return true if any value appears more than once.

// 2. KEYWORD SIGNALS
//    "any value appears twice" → membership check → Set signal
//    No index needed, only whether a value was seen → Set not Map

// 3. BRUTE FORCE SHAPE
//    For every element i, scan every element j before it.
//    Ask: have I seen this value already?
//    → nested loop → O(n²)
//    Alternative brute force: sort, then check adjacent pairs → O(n log n)

// 4. BOTTLENECK
//    The inner loop (or the sort) is doing repeated membership checks.
//    "Have I seen this value?" answered by scanning is O(n).
//    A Set answers it in O(1).

// 5. PATTERN MATCHED
//    Set. Add each value as we walk. Before adding, check if it's already
//    there. First hit → return true. End of array → return false.
//    O(n) time, O(n) space.

// ─────────────────────────────────────────────────────────────
// #242 Valid Anagram
// https://leetcode.com/problems/valid-anagram/
// ─────────────────────────────────────────────────────────────

// 1. RESTATE
//    Given two strings, return true if one is a rearrangement of the other.

// 2. KEYWORD SIGNALS
//    "rearrangement" / "same characters" → frequency comparison → Map signal
//    Not membership ("have I seen it") but frequency ("how many times") → Map not Set

// 3. BRUTE FORCE SHAPE
//    Sort both strings, compare character by character.
//    → O(n log n) for sort, O(n) for compare

// 4. BOTTLENECK
//    Sorting is the bottleneck at O(n log n).
//    What we actually need is: does every character appear the same number
//    of times in both strings? That's a frequency count, not a sort.

// 5. PATTERN MATCHED
//    Map for frequency count. One pass over s to increment, one pass over t
//    to decrement. All zeros → anagram. Any non-zero → not an anagram.
//    O(n) time, O(1) space (at most 26 keys — bounded by alphabet, not input).

// ─────────────────────────────────────────────────────────────
// Template — use this for every new problem
// ─────────────────────────────────────────────────────────────

// 1. RESTATE
//    (one sentence)

// 2. KEYWORD SIGNALS
//    (words that hint at a pattern)

// 3. BRUTE FORCE SHAPE
//    (just the shape — nested loop? sort? try everything?)

// 4. BOTTLENECK
//    (what is slow, and why?)

// 5. PATTERN MATCHED
//    (which structure removes the bottleneck?)

