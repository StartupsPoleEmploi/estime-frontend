import { Table } from "./table";

export class TableElement {
  layout: string;
  style: string;
  table: Table;

  constructor(
    table: Table,
    style: string,
    layout: string
  ) {
    this.layout = layout;
    this.style = style;
    this.table = table;
  }
}
