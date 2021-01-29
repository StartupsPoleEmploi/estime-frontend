import { ASTNode } from '../AST/types';
export declare type MinNode = {
    explanation: Array<ASTNode>;
    nodeKind: 'minimum';
};
export declare const mecanismMin: (v: any, context: any) => MinNode;
