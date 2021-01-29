import { Unit, Evaluation, Types, ASTNode, EvaluatedNode } from './AST/types';
export declare type Period<T> = {
    start: T | null;
    end: T | null;
};
export declare function parsePeriod<Date>(word: string, date: Date): Period<Date>;
export declare type TemporalNode = Temporal<EvaluatedNode & {
    nodeValue: number;
}>;
export declare type Temporal<T> = Array<Period<string> & {
    value: T;
}>;
export declare function narrowTemporalValue<T extends Types>(period: Period<string>, temporalValue: Temporal<Evaluation<T>>): Temporal<Evaluation<T>>;
export declare function createTemporalEvaluation<T extends Types>(value: Evaluation<T>, period?: Period<string>): Temporal<Evaluation<T>>;
export declare function pureTemporal<T>(value: T): Temporal<T>;
export declare function mapTemporal<T1, T2>(fn: (value: T1) => T2, temporalValue: Temporal<T1>): Temporal<T2>;
export declare function sometime<T1>(fn: (value: T1) => boolean, temporalValue: Temporal<T1>): boolean;
export declare function liftTemporal2<T1, T2, T3>(fn: (value1: T1, value2: T2) => T3, temporalValue1: Temporal<T1>, temporalValue2: Temporal<T2>): Temporal<T3>;
export declare function concatTemporals<T, U>(temporalValues: Array<Temporal<T>>): Temporal<Array<T>>;
export declare function liftTemporalNode<N extends ASTNode>(node: N): Temporal<Pick<N, Exclude<keyof N, 'temporalValue'>>>;
export declare function zipTemporals<T1, T2>(temporalValue1: Temporal<T1>, temporalValue2: Temporal<T2>, acc?: Temporal<[T1, T2]>): Temporal<[T1, T2]>;
export declare function groupByYear<T>(temporalValue: Temporal<T>): Array<Temporal<T>>;
export declare function temporalAverage(temporalValue: Temporal<Evaluation<number>>, unit?: Unit): Evaluation<number>;
export declare function temporalCumul(temporalValue: Temporal<Evaluation<number>>, unit: Unit): Evaluation<number>;
