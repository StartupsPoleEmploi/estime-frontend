import { ASTNode } from './AST/types';
import { Context } from './parsePublicodes';
import { ReferenceNode } from './reference';
import { ReplacementRule } from './replacement';
export declare type Rule = {
    formule?: Record<string, unknown> | string;
    question?: string;
    description?: string;
    unité?: string;
    acronyme?: string;
    exemples?: any;
    nom: string;
    résumé?: string;
    icônes?: string;
    titre?: string;
    sévérité?: string;
    cotisation?: {
        branche: string;
    };
    type?: string;
    note?: string;
    remplace?: RendNonApplicable | Array<RendNonApplicable>;
    'rend non applicable'?: Remplace | Array<string>;
    suggestions?: Record<string, string | number | Record<string, unknown>>;
    références?: {
        [source: string]: string;
    };
    API?: string;
    'identifiant court'?: string;
};
declare type Remplace = {
    règle: string;
    par?: Record<string, unknown> | string | number;
    dans?: Array<string> | string;
    'sauf dans'?: Array<string> | string;
} | string;
declare type RendNonApplicable = Exclude<Remplace, {
    par: any;
}>;
export declare type RuleNode = {
    dottedName: string;
    title: string;
    nodeKind: 'rule';
    virtualRule: boolean;
    rawNode: Rule;
    replacements: Array<ReplacementRule>;
    explanation: {
        parent: ASTNode | false;
        valeur: ASTNode;
    };
    suggestions: Record<string, ASTNode>;
    'identifiant court'?: string;
};
export default function parseRule(rawRule: Rule, context: Context): ReferenceNode;
export {};
