import { Context } from './parsePublicodes';
export declare type ReferenceNode = {
    nodeKind: 'reference';
    name: string;
    contextDottedName: string;
    dottedName?: string;
};
export default function parseReference(v: string, context: Context): ReferenceNode;
