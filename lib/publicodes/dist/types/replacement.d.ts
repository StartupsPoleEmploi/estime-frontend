import { Logger } from '.';
import { ASTNode } from './AST/types';
import { Context } from './parsePublicodes';
import { Rule, RuleNode } from './rule';
export declare type ReplacementRule = {
    nodeKind: 'replacementRule';
    definitionRule: ASTNode & {
        nodeKind: 'reference';
    };
    replacedReference: ASTNode & {
        nodeKind: 'reference';
    };
    replacementNode: ASTNode;
    whiteListedNames: Array<ASTNode & {
        nodeKind: 'reference';
    }>;
    rawNode: any;
    blackListedNames: Array<ASTNode & {
        nodeKind: 'reference';
    }>;
    remplacementRuleId: number;
};
export declare function parseReplacements(replacements: Rule['remplace'], context: Context): Array<ReplacementRule>;
export declare function parseRendNonApplicable(rules: Rule['rend non applicable'], context: Context): Array<ReplacementRule>;
export declare function getReplacements(parsedRules: Record<string, RuleNode>): Record<string, Array<ReplacementRule>>;
export declare function inlineReplacements(replacements: Record<string, Array<ReplacementRule>>, logger: Logger): (n: ASTNode) => ASTNode;
