import { ASTNode } from '../AST/types';
export declare type UneDeCesConditionsNode = {
    explanation: Array<ASTNode>;
    nodeKind: 'une de ces conditions';
};
export declare const mecanismOneOf: (v: any, context: any) => {
    explanation: ASTNode[];
    nodeKind: string;
};
