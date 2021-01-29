import { ASTNode } from '../AST/types';
export declare type MaxNode = {
    explanation: Array<ASTNode>;
    nodeKind: 'maximum';
};
export declare const mecanismMax: (v: any, context: any) => MaxNode;
