import { ASTNode } from '../AST/types';
export declare type NonApplicableSiNode = {
    explanation: {
        condition: ASTNode;
        valeur: ASTNode;
    };
    nodeKind: 'non applicable si';
};
declare function parseNonApplicable(v: any, context: any): NonApplicableSiNode;
declare namespace parseNonApplicable {
    var nom: "non applicable si";
}
export default parseNonApplicable;
