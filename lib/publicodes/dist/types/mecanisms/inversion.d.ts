import { EvaluationFunction } from '..';
import { Unit } from '../AST/types';
import { Context } from '../parsePublicodes';
import { ReferenceNode } from '../reference';
export declare type InversionNode = {
    explanation: {
        ruleToInverse: string;
        inversionCandidates: Array<ReferenceNode>;
        unit?: Unit;
    };
    nodeKind: 'inversion';
};
export declare const evaluateInversion: EvaluationFunction<'inversion'>;
export declare const mecanismInversion: (v: any, context: Context) => InversionNode;
