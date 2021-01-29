import { TrancheNodes } from './trancheUtils';
import { ASTNode } from '../AST/types';
export declare type TauxProgressifNode = {
    explanation: {
        tranches: TrancheNodes;
        multiplicateur: ASTNode;
        assiette: ASTNode;
    };
    nodeKind: 'taux progressif';
};
export default function parseTauxProgressif(v: any, context: any): TauxProgressifNode;
