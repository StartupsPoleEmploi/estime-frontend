import { TickOptions } from "chart.js";
import { GridLines } from "./gridLines/gridLines";
import { ScaleLabel } from "./scaleLabel/scaleLabel";
import { Ticks } from "./ticks/ticks";

export class Axes {
    stacked: boolean;
    gridLines: GridLines;
    scaleLabel: ScaleLabel;
    ticks: Ticks;
}