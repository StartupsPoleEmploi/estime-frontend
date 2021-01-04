
import { Injectable } from '@angular/core';
import { Cell } from "../models/table/cell";
import { Style } from "../models/style";
import { Table } from "../models/table/table";
import { TableElement } from "../models/table/table-element";
import { Rectangle } from "../models/figure/elements/rectangle";
import { Figure } from "../models/figure/figure";

@Injectable({ providedIn: 'root' })
export class BlockInformationsService {

  public addBlockInformations(content: Array<any>): any {
    this.addTableInformations(content);
    this.addRectangle(content);
  }


  private addTableInformations(content: Array<any>): any {
    let body = new Array<Array<Cell>>();

    const row = new Array<Cell>();
    row.push(this.createCell1());
    row.push(this.createCell2());
    body.push(row);
    content.push(this.createTableElement(body));
  }

  private createTableElement(body: Array<Array<Cell>>): TableElement {
    const tableElement = new TableElement();
    tableElement.style = 'tableStyle1';
    tableElement.layout = 'noBorders';

    const table = new Table();
    table.widths = ['auto', '*'];
    table.body = body;
    tableElement.table = table;

    return tableElement;
  }

  private createCell1(): Cell {
    const cell = new Cell();
    cell.image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAWgBaAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAAhACEDAREAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAABQcAAgYIA//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAXIBTyCQ0hRmzKAAXpszfmWLCKHKASoSHAQ5yMqdbkP/xAAiEAACAQMEAgMAAAAAAAAAAAAEBQYCAwcAARAXFDQWNTb/2gAIAQEAAQUCkkkviF/ArRVuzAVdYySQHCNdY/t+fbkp9a5RFL4hUdyCu3Mjfb9nWN69hlTz6XHv4yfMNl8U6fJ1IEhwjYp9F5fQIxhsLrWLD5O34y/62H/e4//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQMBAT8BT//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQIBAT8BT//EADcQAAEDAgMDBwoHAAAAAAAAAAIBAwQABRESISIxcRATFDJhofAGJDNBQlJygZLBNFFTc3Sy4f/aAAgBAQAGPwJm1WplJV3kJmRC6jAe+fj/AE3/ACgucm5uYZjQnVaYDgKbqCRYbhJt2O0D0SQpgXFFXVKSy30BSYQ5o0tv0clE38C8cauN9cXO/cJB5SX2WhXKI91POjbyuQYYOMiSJsYaquPqqC7BjdDimGIMp7OuvfT0lrAZcDztlz3VDVe7Gvw4/VUq0rsvW6U40Qr+SkqiXz+1T/47n9Vq1ftfdan6Z3ZAdGbBN5Eemnevyre39VBfbKgnMQebkxCXBJIcfUSeO1uLekWHIZ2ljTSJhQXjolGdudA5DyZeaiOlII+zeqUxeLwx0OLG1hW8usi/qH29nheSP8K0vwLy/wD/xAAkEAACAQMCBgMAAAAAAAAAAAABEQAhQVEQMSBhcYGR8aGx8P/aAAgBAQABPyFn/I4hMLYF/AgFWlCRFXQgy1dCGuHm3gHKYh53ga2YrFx9U0DohaVJdk3xiEAYq8xZhKIPeDCUGt5Jz3F3ceKwvzKXZRlYnsUB6aMknpEYqCUQOSGQcuXJC5AKNHBh6IXpdAoemFBPDs/wjuJ57CCiLFKzQQoXlTPGFF+nYhstX4GeCv8A/9oADAMBAAIAAwAAABCCSSCQACQCSQSf/8QAFBEBAAAAAAAAAAAAAAAAAAAAQP/aAAgBAwEBPxBP/8QAFBEBAAAAAAAAAAAAAAAAAAAAQP/aAAgBAgEBPxBP/8QAHhABAQEAAgMAAwAAAAAAAAAAAREhAEEQMVEgYfD/2gAIAQEAAT8QfzxIFfYgXA1D3zMJCSCjAiGoINC80cU8xhIxETSIspyUym+KEAXYh7gL8C9MhJ0cw6HsLrXChkyC3MgKBM5KkBsqixQ7fU0dXjrLrCcRd01Yhox4EB37kcQ+V3dJiKVSFDXkSYijpwZFuGLT7kWNReJiDafiAWAAvQLFydh2eACbp6G0RoziE9IhQtWoVay7xzKM0kOpggsC8E38A38r9ef/2Q==';
    cell.width = 20;
    cell.height = 20;
    return cell;
  }

  private createCell2(): Cell {
    const cell = new Cell();
    cell.text = 'Le montant total de la simulation ne prend pas en compte les allocations logement, familiales, autres ressources du foyer et le prélèvement à la source.';

    const style = new Style();
    style.color = '#23333C';
    style.fontSize = 12;
    cell.style = style;

    return cell;
  }

  private addRectangle(content: Array<any>): any {
    const figure = new Figure(new Array<any>());
    const rectangle = new Rectangle(
      0,
      -50,
      515,
      50,
      5,
      '#D6D9E4'
    );
    figure.canvas.push(rectangle);
    content.push(figure);
  }
}