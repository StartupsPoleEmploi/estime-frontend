import { ASTNode } from '../AST/types';
export declare type ArrondiNode = {
    explanation: {
        arrondi: ASTNode;
        valeur: ASTNode;
    };
    nodeKind: 'arrondi';
};
declare function parseArrondi(v: any, context: any): {
    explanation: {
        valeur: ASTNode;
        arrondi: ASTNode;
    };
    nodeKind: "arrondi";
};
declare namespace parseArrondi {
    var nom: "arrondi";
}
export default parseArrondi;
