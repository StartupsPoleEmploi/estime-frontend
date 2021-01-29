import { ASTNode } from '../AST/types';
export declare type ApplicableSiNode = {
    explanation: {
        condition: ASTNode;
        valeur: ASTNode;
    };
    nodeKind: 'applicable si';
};
declare function parseApplicable(v: any, context: any): {
    explanation: {
        valeur: ASTNode;
        condition: ASTNode;
    };
    nodeKind: "applicable si";
};
declare namespace parseApplicable {
    var nom: "applicable si";
}
export default parseApplicable;
