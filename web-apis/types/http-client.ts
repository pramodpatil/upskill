// ─────────────────────────────────────────────────────────────
// HTTP Client — Type Definitions
// ─────────────────────────────────────────────────────────────

// ── Client configuration ──────────────────────────────────────
// Passed once when you create the HttpClient instance.
// All requests inherit these defaults automatically.
export interface HttpClientConfig {
    // Base URL prepended to every path.
    // e.g. "http://localhost:3000"
    // client.get("/users/1") → "http://localhost:3000/users/1"
    baseUrl: string;

    // Headers sent with every request (e.g. Authorization, Accept).
    // Record<string, string> = an object where both key and value are strings.
    // { "Authorization": "Bearer token123", "Accept": "application/json" }
    // Optional — defaults to no extra headers.
    defaultHeaders?: Record<string, string>;

    // Milliseconds before a request is aborted automatically.
    // Optional — defaults to 10 000 ms (10 s).
    timeout?: number;
}

// ── HTTP methods ──────────────────────────────────────────────
// Strict union — only these four are valid.
// 'UPDATE' is not a real HTTP method — the correct one is 'PUT'.
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

// ── Per-request options ───────────────────────────────────────
// Passed to each .get() / .post() / .put() / .delete() call.
// Everything is optional — the client fills in sensible defaults.
export interface RequestOptions {
    // Extra headers for this one request only.
    // Merged with defaultHeaders from config; these win on collision.
    headers?: Record<string, string>;

    // Request body — for POST / PUT only.
    // unknown because you can pass any shape — the client serialises it to JSON.
    body?: unknown;

    // Override the client-level timeout for this one request.
    timeout?: number;
}

// ─────────────────────────────────────────────────────────────
// Why two interfaces?
//
// HttpClientConfig → set once, applies to ALL requests
//     (base URL, default auth header, global timeout)
//
// RequestOptions   → per-call tweaks
//     (different body, extra headers, longer timeout for a slow endpoint)
//
// const client = new HttpClient({ baseUrl: "http://localhost:3000" });
// const user   = await client.get<User>("/users/1");
// const post   = await client.post<Post>("/posts", { body: newPost });
// ─────────────────────────────────────────────────────────────
