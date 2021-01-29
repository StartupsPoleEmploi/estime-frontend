import { ASTNode } from '../AST/types';
export declare type PlafondNode = {
    explanation: {
        plafond: ASTNode;
        valeur: ASTNode;
    };
    nodeKind: 'plafond';
};
declare function parsePlafond(v: any, context: any): PlafondNode;
declare namespace parsePlafond {
    var nom: string;
}
export default parsePlafond;
