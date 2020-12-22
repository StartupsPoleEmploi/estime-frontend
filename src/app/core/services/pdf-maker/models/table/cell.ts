import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { Style } from "../style";

export class Cell {
  colSpan?: number;
  image?: string;
  rowSpan?: number;
  style?: Style;
  text?: string;
  width?: number;
  height?: number;
}
