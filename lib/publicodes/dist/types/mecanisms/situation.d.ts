import { ASTNode } from '../AST/types';
export declare type SituationNode = {
    explanation: {
        situationKey: string;
        valeur: ASTNode;
        situationValeur?: ASTNode;
    };
    nodeKind: 'nom dans la situation';
};
declare function parseSituation(v: any, context: any): SituationNode;
declare namespace parseSituation {
    var nom: "nom dans la situation";
}
export default parseSituation;
