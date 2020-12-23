import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { Style } from "../style";

export class Cell {
  colSpan: number;
  fillColor: string;
  height: number;
  image: string;
  rowSpan: number;
  style: Style;
  text: any;
  width: number;
}
