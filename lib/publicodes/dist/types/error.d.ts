import { Logger } from '.';
export declare class EngineError extends Error {
}
export declare function syntaxError(dottedName: string, message: string, originalError?: Error): void;
export declare function warning(logger: Logger, rule: string, message: string, originalError?: Error): void;
export declare function evaluationError(logger: Logger, rule: string, message: string, originalError?: Error): void;
export declare class InternalError extends EngineError {
    constructor(payload: any);
}
