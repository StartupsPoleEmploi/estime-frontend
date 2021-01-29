import { ASTNode } from '../AST/types';
import { Context } from '../parsePublicodes';
export declare type AbattementNode = {
    explanation: {
        assiette: ASTNode;
        abattement: ASTNode;
    };
    nodeKind: 'abattement';
};
declare function parseAbattement(v: any, context: Context): {
    explanation: {
        assiette: ASTNode;
        abattement: ASTNode;
    };
    nodeKind: "abattement";
};
declare namespace parseAbattement {
    var nom: "abattement";
}
export default parseAbattement;
