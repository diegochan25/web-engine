export interface StateMachineErrorOptions {
    cause?: unknown;
}

export class StateMachineError extends Error {
    constructor()
    constructor(message: string)
    constructor(message: string, options: StateMachineErrorOptions)
    constructor(message?: string, options?: StateMachineErrorOptions) {
        super(message, options);
        this.name = "StateMachineError";
    }
}