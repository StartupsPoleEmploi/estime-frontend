import { RuleNode } from './rule';
export declare const nameLeaf: (name: string) => string;
export declare const encodeRuleName: (name: any) => any;
export declare const decodeRuleName: (name: any) => any;
export declare function ruleParents(dottedName: string): Array<string>;
export declare function disambiguateRuleReference<R extends Record<string, RuleNode>>(rules: R, contextName: string | undefined, partialName: string): keyof R;
export declare function ruleWithDedicatedDocumentationPage(rule: any): boolean;
