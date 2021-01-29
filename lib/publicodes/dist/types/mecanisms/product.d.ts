import { ASTNode } from '../AST/types';
export declare type ProductNode = {
    explanation: {
        assiette: ASTNode;
        facteur: ASTNode;
        plafond: ASTNode;
        taux: ASTNode;
    };
    nodeKind: 'produit';
};
export declare const mecanismProduct: (v: any, context: any) => ProductNode;
