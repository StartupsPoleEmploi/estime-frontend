import Engine from '..';
import { ASTNode } from '../AST/types';
declare type TrancheNode = {
    taux: ASTNode;
} | {
    montant: ASTNode;
};
export declare type TrancheNodes = Array<TrancheNode & {
    plafond?: ASTNode;
}>;
export declare const parseTranches: (tranches: any, context: any) => TrancheNodes;
export declare function evaluatePlafondUntilActiveTranche(this: Engine, { multiplicateur, assiette, parsedTranches }: {
    multiplicateur: any;
    assiette: any;
    parsedTranches: any;
}): any;
export {};
