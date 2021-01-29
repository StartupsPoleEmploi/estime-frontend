import { ASTNode } from '../AST/types';
export declare type VariationNode = {
    explanation: Array<{
        condition: ASTNode;
        consequence: ASTNode;
        satisfied?: boolean;
    }>;
    nodeKind: 'variations';
};
export declare const devariate: (k: any, v: any, context: any) => ASTNode;
export default function parseVariations(v: any, context: any): VariationNode;
