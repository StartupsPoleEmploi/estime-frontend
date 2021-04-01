import { TickOptions } from "chart.js";
import { GridLines } from "./gridLines/gridLines";
import { ScaleLabel } from "./scaleLabel/scaleLabel";
import { Ticks } from "./ticks/ticks";

export class Axes {
    stacked: Boolean;
    gridLines: GridLines;
    scaleLabel: ScaleLabel;
    ticks: Ticks;
}