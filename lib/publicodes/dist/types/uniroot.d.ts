/**
 * Copied from https://gist.github.com/borgar/3317728
 *
 * Searches the interval from <tt>lowerLimit</tt> to <tt>upperLimit</tt>
 * for a root (i.e., zero) of the function <tt>func</tt> with respect to
 * its first argument using Brent's method root-finding algorithm.
 *
 * Translated from zeroin.c in http://www.netlib.org/c/brent.shar.
 *
 * Copyright (c) 2012 Borgar Thorsteinsson <borgar@borgar.net>
 * MIT License, http://www.opensource.org/licenses/mit-license.php
 *
 * @param func function for which the root is sought.
 * @param lowerLimit the lower point of the interval to be searched.
 * @param upperLimit the upper point of the interval to be searched.
 * @param errorTol the desired accuracy (convergence tolerance).
 * @param maxIter the maximum number of iterations.
 * @param acceptableErrorTol return a result even if errorTol isn't reached after maxIter.
 * @returns an estimate for the root within accuracy.
 *
 */
export default function uniroot(func: (x: number) => number, lowerLimit: number, upperLimit: number, errorTol?: number, maxIter?: number, acceptableErrorTol?: number): number | undefined;
