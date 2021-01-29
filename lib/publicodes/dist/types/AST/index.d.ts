import { RuleNode } from '../rule';
import { ASTNode } from './types';
declare type TransformASTFunction = (n: ASTNode) => ASTNode;
/**
    This function creates a transormation of the AST from on a simpler
    callback function `fn`

    `fn` will be called with the nodes of the ASTTree during the exploration

    The outcome of the callback function has an influence on the exploration of the AST :
    - `false`, the node is not updated and the exploration does not continue further down this branch
    - `undefined`, the node is not updated but the exploration continues and its children will be transformed
    - `ASTNode`, the node is transformed to the new value and the exploration does not continue further down the branch

    `updateFn` : It is possible to specifically use the updated version of a child
    by using the function passed as second argument. The returned value will be the
    transformed version of the node.
    */
export declare function transformAST(fn: (node: ASTNode, updateFn: TransformASTFunction) => ASTNode | undefined | false): TransformASTFunction;
/**
        This function allows to construct a specific value while exploring the AST with
        a simple reducing function as argument.

        `fn` will be called with the currently reduced value `acc` and the current node of the AST


        The outcome of the callback function has an influence on the exploration of the AST :
        - `undefined`, the exploration continues further down and all the child are reduced
            successively to a single value
        - `T`, the reduced value

        `reduceFn` : It is possible to specifically use the reduced value of a child
        by using the function passed as second argument. The returned value will be the reduced version
        of the node
        */
export declare function reduceAST<T>(fn: (acc: T, n: ASTNode, reduceFn: (n: ASTNode) => T) => T | undefined, start: T, node: ASTNode): T;
export declare function traverseParsedRules(fn: (n: ASTNode) => ASTNode, parsedRules: Record<string, RuleNode>): Record<string, RuleNode>;
export {};
