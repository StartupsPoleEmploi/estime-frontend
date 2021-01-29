import { ParsedRules, Logger } from '.';
import { Rule, RuleNode } from './rule';
import { getUnitKey } from './units';
export declare type Context = {
    dottedName: string;
    parsedRules: Record<string, RuleNode>;
    ruleTitle?: string;
    getUnitKey?: getUnitKey;
    logger: Logger;
};
declare type RawRule = Omit<Rule, 'nom'> | string | undefined | number;
export declare type RawPublicodes = Record<string, RawRule> | string;
export default function parsePublicodes(rawRules: RawPublicodes, partialContext?: Partial<Context>): ParsedRules<string>;
export declare const disambiguateReference: (parsedRules: Record<string, RuleNode>) => (n: import(".").ASTNode) => import(".").ASTNode;
export {};
