// ─────────────────────────────────────────────────────────────
// Error hierarchy
//
// Error                   ← built-in
//   └── AppError          ← base for every error in this app (has code)
//         └── HttpError   ← API/network failures (has status)
//               ├── NotFoundError      → 404
//               └── UnauthorizedError  → 401
//
// Why a hierarchy?
// Catch at the right level — instanceof NotFoundError is also instanceof
// HttpError and also instanceof AppError. Most specific first, general last.
// ─────────────────────────────────────────────────────────────

// Base — every error in the app has a machine-readable code.
// `code` lets you switch/match on the error type without string-comparing names.
class AppError extends Error {
    constructor(public code: string, message: string) {
        super(message);
        this.name = "AppError";
    }
}

// HTTP errors — adds status so callers can check the exact HTTP status code.
// Passes a fixed code "HTTP_ERROR" up to AppError.
class HttpError extends AppError {
    constructor(public status: number, message: string) {
        super("HTTP_ERROR", message);
        this.name = "HttpError";
    }
}

// 404 — resource does not exist.
// Caller passes the resource name so the message is descriptive.
// No need to pass 404 — it's always 404 for this error.
class NotFoundError extends HttpError {
    constructor(resource: string) {
        super(404, `${resource} not found`);
        this.name = "NotFoundError";
    }
}

// 401 — not logged in or token expired.
// No parameters needed — the message is always the same.
class UnauthorizedError extends HttpError {
    constructor() {
        super(401, "Unauthorized — please log in");
        this.name = "UnauthorizedError";
    }
}

// ─────────────────────────────────────────────────────────────
// How to use — catch at the right level
//
// try {
//     const user = await client.get<User>("/users/999");
// } catch (error) {
//     if (error instanceof NotFoundError)    { /* show "not found" in UI */ }
//     else if (error instanceof UnauthorizedError) { /* redirect to login  */ }
//     else if (error instanceof HttpError)   { /* generic server error    */ }
//     else if (error instanceof AppError)    { /* other app error         */ }
//     else                                   { /* totally unexpected      */ }
// }
// ─────────────────────────────────────────────────────────────

export { AppError, HttpError, NotFoundError, UnauthorizedError };