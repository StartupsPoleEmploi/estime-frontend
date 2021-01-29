import { ASTNode } from '../AST/types';
import { TrancheNodes } from './trancheUtils';
export declare type BarèmeNode = {
    explanation: {
        tranches: TrancheNodes;
        multiplicateur: ASTNode;
        assiette: ASTNode;
    };
    nodeKind: 'barème';
};
export default function parseBarème(v: any, context: any): BarèmeNode;
