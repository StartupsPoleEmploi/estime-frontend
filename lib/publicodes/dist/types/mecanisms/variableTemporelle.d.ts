import { ASTNode } from '../AST/types';
export declare type VariableTemporelleNode = {
    explanation: {
        period: {
            start: ASTNode | undefined;
            end: ASTNode | undefined;
        };
        value: ASTNode;
    };
    nodeKind: 'variable temporelle';
};
export default function parseVariableTemporelle(v: any, context: any): VariableTemporelleNode;
