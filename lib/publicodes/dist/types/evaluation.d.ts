import Engine, { EvaluationFunction } from '.';
import { ASTNode, ConstantNode, Evaluation, EvaluatedNode, NodeKind } from './AST/types';
export declare const collectNodeMissing: (node: EvaluatedNode | ASTNode) => Record<string, number>;
export declare const bonus: (missings?: Record<string, number>) => {
    [k: string]: number;
};
export declare const mergeMissing: (left?: Record<string, number> | undefined, right?: Record<string, number> | undefined) => Record<string, number>;
export declare const mergeAllMissing: (missings: Array<EvaluatedNode | ASTNode>) => Record<string, number>;
export declare const evaluateArray: <NodeName extends NodeKind>(reducer: any, start: any) => EvaluationFunction<NodeName>;
export declare const defaultNode: (nodeValue: Evaluation) => ConstantNode;
export declare const parseObject: (objectShape: any, value: any, context: any) => {
    [k: string]: unknown;
};
export declare function evaluateObject<NodeName extends NodeKind>(effet: (this: Engine, explanations: any) => any): EvaluationFunction<NodeName>;
