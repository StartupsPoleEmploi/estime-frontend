import { AbattementNode } from '../mecanisms/abattement';
import { ApplicableSiNode } from '../mecanisms/applicable';
import { ArrondiNode } from '../mecanisms/arrondi';
import { OperationNode } from '../mecanisms/operation';
import { BarèmeNode } from '../mecanisms/barème';
import { ReferenceNode } from '../reference';
import { RuleNode } from '../rule';
import { TouteCesConditionsNode } from '../mecanisms/condition-allof';
import { UneDeCesConditionsNode } from '../mecanisms/condition-oneof';
import { DuréeNode } from '../mecanisms/durée';
import { GrilleNode } from '../mecanisms/grille';
import { InversionNode } from '../mecanisms/inversion';
import { MaxNode } from '../mecanisms/max';
import { PlafondNode } from '../mecanisms/plafond';
import { MinNode } from '../mecanisms/min';
import { NonApplicableSiNode } from '../mecanisms/nonApplicable';
import { ParDéfautNode } from '../mecanisms/parDéfaut';
import { PlancherNode } from '../mecanisms/plancher';
import { ProductNode } from '../mecanisms/product';
import { RecalculNode } from '../mecanisms/recalcul';
import { PossibilityNode } from '../mecanisms/one-possibility';
import { SituationNode } from '../mecanisms/situation';
import { SommeNode } from '../mecanisms/sum';
import { SynchronisationNode } from '../mecanisms/synchronisation';
import { TauxProgressifNode } from '../mecanisms/tauxProgressif';
import { UnitéNode } from '../mecanisms/unité';
import { VariableTemporelleNode } from '../mecanisms/variableTemporelle';
import { VariationNode } from '../mecanisms/variations';
import { ReplacementRule } from '../replacement';
import { Temporal } from '../temporal';
export declare type ConstantNode = {
    type: 'boolean' | 'objet' | 'number' | 'string';
    nodeValue: Evaluation;
    nodeKind: 'constant';
    isDefault?: boolean;
};
export declare type ASTNode = (RuleNode | ReferenceNode | AbattementNode | ApplicableSiNode | ArrondiNode | BarèmeNode | TouteCesConditionsNode | UneDeCesConditionsNode | DuréeNode | GrilleNode | MaxNode | InversionNode | MinNode | NonApplicableSiNode | OperationNode | ParDéfautNode | PossibilityNode | PlafondNode | PlancherNode | ProductNode | RecalculNode | SituationNode | SommeNode | SynchronisationNode | TauxProgressifNode | UnitéNode | VariableTemporelleNode | VariationNode | ConstantNode | ReplacementRule) & {
    isDefault?: boolean;
    visualisationKind?: string;
    rawNode?: string | Record<string, unknown>;
} & (EvaluationDecoration<Types> | {});
export declare type MecanismNode = Exclude<ASTNode, RuleNode | ConstantNode | ReferenceNode>;
export declare type NodeKind = ASTNode['nodeKind'];
export declare type TraverseFunction<Kind extends NodeKind> = (fn: (n: ASTNode) => ASTNode, node: ASTNode & {
    nodeKind: Kind;
}) => ASTNode & {
    nodeKind: Kind;
};
declare type BaseUnit = string;
export declare type Unit = {
    numerators: Array<BaseUnit>;
    denominators: Array<BaseUnit>;
};
declare type EvaluationDecoration<T extends Types> = {
    nodeValue: Evaluation<T>;
    missingVariables: Record<string, number>;
    unit?: Unit;
    temporalValue?: Temporal<Evaluation>;
};
export declare type Types = number | boolean | string | Record<string, unknown>;
export declare type Evaluation<T extends Types = Types> = T | false | null;
export declare type EvaluatedNode<T extends Types = Types> = ASTNode & EvaluationDecoration<T>;
export {};
