import { ASTNode } from '../AST/types';
export declare type TouteCesConditionsNode = {
    explanation: Array<ASTNode>;
    nodeKind: 'toutes ces conditions';
};
export declare const mecanismAllOf: (v: any, context: any) => {
    explanation: ASTNode[];
    nodeKind: string;
};
