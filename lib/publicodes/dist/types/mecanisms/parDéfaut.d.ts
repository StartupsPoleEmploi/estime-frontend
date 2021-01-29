import { ASTNode } from '../AST/types';
export declare type ParDéfautNode = {
    explanation: {
        valeur: ASTNode;
        parDéfaut: ASTNode;
    };
    nodeKind: 'par défaut';
};
declare function parseParDéfaut(v: any, context: any): ParDéfautNode;
declare namespace parseParDéfaut {
    var nom: "par défaut";
}
export default parseParDéfaut;
