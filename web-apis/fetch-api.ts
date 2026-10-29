// Run: npx ts-node web-apis/fetch-api.ts
// Make sure json-server is running: npx json-server db/db.json --port 3000

async function fetchUser(id: number) {
    const response = await fetch(`http://localhost:3001/users/${id}`);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
}

// Top-level await needs an async wrapper in Node.js
(async () => {
    try {
        const user = await fetchUser(1);
        console.log(user);

        // // Try a user that doesn't exist — see the error
        const missing = await fetchUser(999);
        console.log('missing ', missing);
    } catch (error) {
        if(error instanceof Error) {
            console.error("Error:", error.name);
            console.error("Error:", error.message);
            console.error("Error:", error.stack);
        }
    }
})();
