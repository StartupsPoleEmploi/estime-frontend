import { ASTNode, Unit } from '../AST/types';
export declare type UnitéNode = {
    unit: Unit;
    explanation: ASTNode;
    nodeKind: 'unité';
};
declare function parseUnité(v: any, context: any): UnitéNode;
declare namespace parseUnité {
    var nom: "unité";
}
export default parseUnité;
