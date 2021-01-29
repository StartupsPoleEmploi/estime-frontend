import { ASTNode, EvaluatedNode, NodeKind } from './AST/types';
import parsePublicodes from './parsePublicodes';
import { ReplacementRule } from './replacement';
import { Rule, RuleNode } from './rule';
import * as utils from './ruleUtils';
import { formatUnit, getUnitKey } from './units';
declare type Cache = {
    _meta: {
        ruleStack: Array<string>;
        parentEvaluationStack?: Array<string>;
        inversionFail?: {
            given: string;
            estimated: string;
        } | true;
        inRecalcul?: boolean;
        filter?: string;
    };
    nodes: Map<PublicodesExpression | ASTNode, EvaluatedNode>;
};
export declare type EvaluationOptions = Partial<{
    unit: string;
}>;
export { reduceAST, transformAST } from './AST/index';
export { Evaluation, Unit } from './AST/types';
export { capitalise0, formatValue } from './format';
export { simplifyNodeUnit } from './nodeUnits';
export { default as serializeEvaluation } from './serializeEvaluation';
export { parseUnit, serializeUnit } from './units';
export { parsePublicodes, utils };
export { Rule, RuleNode, ASTNode, EvaluatedNode };
declare type PublicodesExpression = string | Record<string, unknown> | number;
export declare type Logger = {
    log(message: string): void;
    warn(message: string): void;
    error(message: string): void;
};
declare type Options = {
    logger: Logger;
    getUnitKey?: getUnitKey;
    formatUnit?: formatUnit;
};
export declare type EvaluationFunction<Kind extends NodeKind = NodeKind> = (this: Engine, node: ASTNode & {
    nodeKind: Kind;
}) => ASTNode & {
    nodeKind: Kind;
} & EvaluatedNode;
export declare type ParsedRules<Name extends string> = Record<Name, RuleNode & {
    dottedName: Name;
}>;
export default class Engine<Name extends string = string> {
    parsedRules: ParsedRules<Name>;
    parsedSituation: Record<string, ASTNode>;
    replacements: Record<string, Array<ReplacementRule>>;
    cache: Cache;
    options: Options;
    constructor(rules?: string | Record<string, Rule> | ParsedRules<Name>, options?: Partial<Options>);
    setOptions(options: Partial<Options>): void;
    resetCache(): void;
    setSituation(situation?: Partial<Record<Name, PublicodesExpression | ASTNode>>): this;
    private parse;
    inversionFail(): boolean;
    getRule(dottedName: Name): ParsedRules<Name>[Name];
    getParsedRules(): ParsedRules<Name>;
    evaluate<N extends ASTNode = ASTNode>(value: N): N & EvaluatedNode;
    evaluate(value: PublicodesExpression): EvaluatedNode;
}
/**
    This function allows to mimic the former 'isApplicable' property on evaluatedRules

    It will be deprecated when applicability will be encoded as a Literal type
*/
export declare function UNSAFE_isNotApplicable<DottedName extends string = string>(engine: Engine<DottedName>, dottedName: DottedName): boolean;
