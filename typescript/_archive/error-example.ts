//custom error class
class ApplicationErr extends Error {
    constructor(message: string, originalError?: unknown) {
        super(message, {cause: originalError});
        this.name = 'appError'
    }
}

function divide (a: number, b:number) {
    if(b === 0) {
        throw new ApplicationErr('Cannot devided by Zero');
    }
    return a / b;
}

try {
    divide(1, 0);
} catch(e) {
    // Typescript error inside catch block is unkonw as it does not know what exactly thrown by error object
    // developer needs to narrow it down.
    if( e instanceof ApplicationErr) {
        console.log(e.name, e.message);
    }
}