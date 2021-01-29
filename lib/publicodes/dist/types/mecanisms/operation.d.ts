import { ASTNode } from '../AST/types';
declare const knownOperations: {
    readonly '*': readonly [(a: any, b: any) => number, "×"];
    readonly '/': readonly [(a: any, b: any) => number, "∕"];
    readonly '+': readonly [(a: any, b: any) => any];
    readonly '-': readonly [(a: any, b: any) => number, "−"];
    readonly '<': readonly [(a: any, b: any) => boolean];
    readonly '<=': readonly [(a: any, b: any) => boolean, "≤"];
    readonly '>': readonly [(a: any, b: any) => boolean];
    readonly '>=': readonly [(a: any, b: any) => boolean, "≥"];
    readonly '=': readonly [(a: any, b: any) => boolean];
    readonly '!=': readonly [(a: any, b: any) => boolean, "≠"];
};
export declare type OperationNode = {
    nodeKind: 'operation';
    explanation: [ASTNode, ASTNode];
    operationKind: keyof typeof knownOperations;
    operator: string;
};
declare const operationDispatch: {
    [k: string]: (v: any, context: any) => OperationNode;
};
export default operationDispatch;
