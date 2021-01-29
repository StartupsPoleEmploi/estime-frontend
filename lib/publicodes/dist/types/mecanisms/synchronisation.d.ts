import { ASTNode } from '../AST/types';
export declare type SynchronisationNode = {
    explanation: {
        chemin: string;
        data: ASTNode;
    };
    nodeKind: 'synchronisation';
};
export declare const mecanismSynchronisation: (v: any, context: any) => SynchronisationNode;
