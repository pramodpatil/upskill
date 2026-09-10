/**
 * 242. Valid Anagram — Easy
 * https://leetcode.com/problems/valid-anagram/
 *
 * Pattern: frequency count with Map / sort-and-compare
 *
 * Given two strings s and t, return true if t is an anagram of s.
 * An anagram uses every character of the original exactly once.
 */

// ─────────────────────────────────────────────────────────────
// Approach 1 — sort and compare
// Time: O(n log n)   Space: O(n)
//
// Sorted anagrams are identical strings. Split both into character
// arrays, sort, then walk them in lockstep.
//
// Sort trap from notes: .sort() without a comparator converts to
// strings — dangerous for numbers like [10, 9, 100]. Safe here
// because single characters always sort correctly lexicographically.
//
// Length guard first: different lengths can never be anagrams, and
// it avoids sorting arrays we'll immediately discard.
// ─────────────────────────────────────────────────────────────

function isAnagramSort(s: string, t: string): boolean {
    if (s.length !== t.length) return false;

    const source = s.split('').sort();
    const target = t.split('').sort();

    for (let i = 0; i < source.length; i++) {
        if (source[i] !== target[i]) return false;
    }

    return true;
}

// ─────────────────────────────────────────────────────────────
// Approach 2 — frequency Map (preferred)
// Time: O(n)    Space: O(1)
//
// The reframe: not "have I seen this character?" (membership → Set)
// but "does every character appear the same number of times?"
// (frequency → Map).
//
// One Map, two passes:
//   Pass 1 over s: increment each character's count.
//   Pass 2 over t: decrement each character's count.
//   If t is a perfect anagram, every count lands back at 0.
//   Any non-zero count means a character was used a different
//   number of times.
//
// Space is O(1) not O(n): the Map holds at most 26 keys for
// lowercase letters — bounded by the alphabet, not by input size.
//
// ?? 0 — get() returns `undefined` for a key never inserted, and
// undefined + 1 is NaN. The nullish coalescing operator supplies 0
// as the default for the first occurrence of any character.
// ─────────────────────────────────────────────────────────────

function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;

    const freq = new Map<string, number>();

    for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
    for (const ch of t) freq.set(ch, (freq.get(ch) ?? 0) - 1);

    for (const count of freq.values()) {
        if (count !== 0) return false;
    }

    return true;
}

// ─────────────────────────────────────────────────────────────
// Trade-off — Map wins on both axes here
//
//               Time          Space
//   Sort        O(n log n)    O(n)   ← two new arrays from split
//   Map         O(n)          O(1)   ← at most 26 keys, fixed
//
// "Map is faster AND uses less memory. The sort approach is readable
//  and fine in an interview, but if asked to optimize, Map is the
//  right answer — and the space gain is real: the character set is
//  bounded regardless of how large the input grows."
//
// Note: this is the opposite of Contains Duplicate where the trade-off
// had no winner. Here Map strictly dominates.
// ─────────────────────────────────────────────────────────────

// Trace: s = "anagram", t = "nagaram"
//
// After pass 1 (increment over s = "anagram"):
//   { a → 3, n → 1, g → 1, r → 1, m → 1 }
//
// After pass 2 (decrement over t = "nagaram"):
//   { a → 0, n → 0, g → 0, r → 0, m → 0 }
//
// All zeros → true

// Trace: s = "rat", t = "cat"
//
// After pass 1: { r → 1, a → 1, t → 1 }
// After pass 2: { r → 1, a → 0, t → 0, c → -1 }
//   r is 1 (unused), c is -1 (extra) → false

// ── quick tests ──────────────────────────────────────────────
console.log(isAnagram("anagram", "nagaram"));   // true
console.log(isAnagram("rat", "cat"));           // false
console.log(isAnagram("rat", "car"));           // true  ← same chars
console.log(isAnagram("a", "ab"));              // false ← length guard
console.log(isAnagram("", ""));                 // true  ← both empty

export { isAnagram, isAnagramSort };
