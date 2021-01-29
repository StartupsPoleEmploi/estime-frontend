import { ASTNode } from '../AST/types';
export declare type SommeNode = {
    explanation: Array<ASTNode>;
    nodeKind: 'somme';
};
export declare const mecanismSum: (v: any, context: any) => SommeNode;
