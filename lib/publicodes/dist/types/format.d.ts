import { Evaluation, Unit } from './AST/types';
import { formatUnit } from './units';
export declare const numberFormatter: ({ style, maximumFractionDigits, minimumFractionDigits, language, }: {
    style?: string | undefined;
    maximumFractionDigits?: number | undefined;
    minimumFractionDigits?: number | undefined;
    language?: string | undefined;
}) => (value: number) => string;
export declare const formatCurrency: (value: number | undefined, language: string) => string;
export declare const formatPercentage: (value: number | undefined) => string;
export declare type formatValueOptions = {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    language?: string;
    unit?: Unit | string;
    formatUnit?: formatUnit;
    value: number;
};
export declare function capitalise0(name: undefined): undefined;
export declare function capitalise0(name: string): string;
declare type Options = {
    language?: string;
    displayedUnit?: string;
    precision?: number;
    formatUnit?: formatUnit;
};
export declare function formatValue(value: number | {
    nodeValue: Evaluation;
    unit?: Unit;
} | undefined, { language, displayedUnit, formatUnit, precision }?: Options): any;
export declare function serializeValue({ nodeValue, unit }: {
    nodeValue: Evaluation;
    unit?: Unit;
}, { format }: {
    format: formatUnit;
}): string;
export {};
