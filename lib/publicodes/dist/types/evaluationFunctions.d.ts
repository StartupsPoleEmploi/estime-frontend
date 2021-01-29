import { EvaluationFunction } from '.';
import { ASTNode } from './AST/types';
export declare let evaluationFunctions: any;
export declare function registerEvaluationFunction<NodeName extends ASTNode['nodeKind']>(nodeKind: NodeName, evaluationFunction: EvaluationFunction<NodeName>): void;
