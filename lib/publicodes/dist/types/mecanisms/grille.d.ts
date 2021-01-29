import { TrancheNodes } from './trancheUtils';
import { ASTNode } from '../AST/types';
export declare type GrilleNode = {
    explanation: {
        assiette: ASTNode;
        multiplicateur: ASTNode;
        tranches: TrancheNodes;
    };
    nodeKind: 'grille';
};
export default function parseGrille(v: any, context: any): GrilleNode;
