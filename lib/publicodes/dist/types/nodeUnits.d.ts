import { EvaluatedNode, Unit } from './AST/types';
export declare function simplifyNodeUnit(node: any): any;
export declare function convertNodeToUnit<Node extends EvaluatedNode = EvaluatedNode>(to: Unit | undefined, node: Node): Node;
