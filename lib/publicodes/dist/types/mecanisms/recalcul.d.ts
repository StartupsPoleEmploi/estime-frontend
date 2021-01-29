import { ASTNode } from '../AST/types';
import { ReferenceNode } from '../reference';
export declare type RecalculNode = {
    explanation: {
        recalcul: ASTNode;
        amendedSituation: Array<[ReferenceNode, ASTNode]>;
    };
    nodeKind: 'recalcul';
};
export declare const mecanismRecalcul: (v: any, context: any) => RecalculNode;
