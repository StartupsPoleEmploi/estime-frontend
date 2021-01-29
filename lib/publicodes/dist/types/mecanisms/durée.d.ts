import { ASTNode, Unit } from '../AST/types';
export declare type DuréeNode = {
    explanation: {
        depuis: ASTNode;
        "jusqu'à": ASTNode;
    };
    unit: Unit;
    nodeKind: 'durée';
};
declare const _default: (v: any, context: any) => DuréeNode;
export default _default;
