import { ASTNode } from '../AST/types';
import { Context } from '../parsePublicodes';
export declare type PossibilityNode = {
    explanation: Array<ASTNode>;
    'choix obligatoire'?: 'oui' | 'non';
    context: string;
    nodeKind: 'une possibilité';
};
export declare const mecanismOnePossibility: (v: any, context: Context) => PossibilityNode;
