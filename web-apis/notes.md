# Web APIs — Learning Notes

> Quick-review card. One rule + interview answer + plain words per topic.
> Full code and examples → the linked `.ts` file.
>
> References:
>   - https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
>   - https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal

---

## 1. Fetch API
File: `01-fetch-api.ts`
Rule: `fetch` only rejects on network failure. HTTP errors (404, 500) resolve — always check `response.ok`.

**Interview answer:**
"`fetch` returns a Promise that resolves as long as the server responded — even with a 404 or 500. You must check `response.ok` manually and throw if false. It only rejects on actual network failure like no internet or unreachable server. `response.json()` returns `any`, so use a generic to give the caller type safety."

**In simple words:**
`fetch` doesn't shout at you when something goes wrong on the server — it quietly hands you the response and expects you to check. If you don't check `response.ok`, your code will happily try to use a 404 error response as real data. Always check, always throw if it failed.

---

## 2. AbortSignal
File: `02-abort-signal.ts`
Rule: Pass a signal to `fetch` to cancel it — either manually via `AbortController` or automatically via `AbortSignal.timeout()`.

**Interview answer:**
"`AbortSignal` lets you cancel an in-flight fetch. You create an `AbortController`, pass its `.signal` to fetch, and call `controller.abort()` to cancel. For timeouts, `AbortSignal.timeout(ms)` is the shorthand. Abort errors must be caught separately from network errors — a cancelled request is intentional, not a failure, so you shouldn't show an error to the user."

**In simple words:**
Without `AbortSignal`, a fetch that hangs just... hangs forever. `AbortSignal` gives you a way to pull the plug — either because the user clicked cancel, or because it's been waiting too long. The key thing is: when you abort, the error you get is different from a real network error, so you need to handle it separately and not show a scary message to the user.

---

## 3. Custom HTTP Client
File: `03-http-client.ts` · Usage: `04-http-client-usage.ts`
Rule: Centralise all fetch logic — `response.ok` check, error handling, abort, headers, timeout — in one class so no API call ever repeats it.

**Interview answer:**
"A custom HTTP client wraps `fetch` to handle the things every request needs: checking `response.ok`, throwing typed errors, attaching default headers like `Authorization`, adding a default timeout via `AbortSignal`, and distinguishing abort errors from network errors. It uses generics so the caller declares the expected response type and gets full TypeScript safety."

**In simple words:**
Every time you call `fetch` directly, you have to write the same checks — is `response.ok`? is it an abort? what are the headers? A custom client is just one class that does all of that once. After that, every API call in your app is one line — the client handles everything else behind the scenes.

---

## Error types — know all three

| Error | When | How to detect | What to show user |
|---|---|---|---|
| Network error | No internet, server down | `fetch` rejects | "Check your connection" |
| HTTP error | 404, 500, 403 | `response.ok === false` | "Not found" / "Server error" |
| Abort error | Timeout or user cancel | `error.name === "AbortError"` | Nothing, or "Timed out" |

---

<!-- Add next topic here -->
