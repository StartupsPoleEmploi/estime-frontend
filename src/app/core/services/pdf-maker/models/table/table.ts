import { Cell } from "./cell";

export class Table {
  widths: Array<any>;
  body: Array<Array<any>>;

  constructor(
    widths: Array<any>,
    body: Array<Array<Cell>>
  ) {
    this.widths = widths;
    this.body = body;
  }
}
