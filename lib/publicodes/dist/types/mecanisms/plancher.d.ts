import { ASTNode } from '../AST/types';
export declare type PlancherNode = {
    explanation: {
        plancher: ASTNode;
        valeur: ASTNode;
    };
    nodeKind: 'plancher';
};
declare function Plancher(v: any, context: any): PlancherNode;
declare namespace Plancher {
    var nom: string;
}
export default Plancher;
