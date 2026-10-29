let a = 'Hello';
const b = 'Hello';

// b = 'Test'; // You can not change the value of a constant

type Status = "idle" | "loading" | "success" | "error";

// let s: Status = "loading";   // fine
// s = "pending" as Status; // Error: Type '"pending"' is not assignable to type 'Status'


type Method = "GET" | "POST";

function request(method: Method, url: string) { /* ... */ }

const config = { method: "GET", url: "/users" };

request(config.method, config.url);


// This is nothing but a demonstration of using 'as const' to create a readonly tuple and deriving a type from it
const roles = ["admin", "editor", "viewer"] as const;
type Test = readonly ["admin", "editor", "viewer"]; // both the statements are same

type Role = typeof roles[number];
type TestRole = Test[number];

let admin: Role = roles[0];
// The following line will cause an error because "Owner" is not part of the Role type
let owner1: Role = "Owner";
let owner2: Test = ["admin", "editor", "viewer"];
console.log(owner2);


type Dir = "left" | "right";
function setDirection(dir: Dir) {
    if(dir === 'left')
        return 'left';
    if(dir === 'right')
        return 'right';
}

setDirection("left");

let dir = "left";       // TypeScript widens to: string
const dir1 = 'left'
setDirection(dir);
setDirection(dir1);
setDirection("left");

function respond(status: "success" | "error", code: 200 | 404) {
    console.log(status, code);
}

const s = "success";
let c = 200;

respond(s, c);

const strictConfig = {
  status: "active"
} as const;



// type narrowing

function process(count: number | null) {
    if (count !== null) {
        console.log(count.toFixed(2));   // ✓ only null ruled out, 0 is fine
    }
}
process(0)
process(null)

type Cat = { meow: () => void };
type Dog = { bark: () => void };


type Shape =
    | { kind: "circle";    radius: number }
    | { kind: "rectangle"; width: number; height: number }
    | { kind: "triangle"; base: number; outerHeight: number };

function area(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        default: {
            const _exhaustive: never = shape;   // ✗ Error if a case is missing
            return _exhaustive;
        }
    }
}