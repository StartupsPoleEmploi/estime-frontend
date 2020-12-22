
import { Injectable } from '@angular/core';
import { Cell } from "../models/table/cell";
import { Style } from "../models/style";
import { Table } from "../models/table/table";
import { TableElement } from "../models/table/table-element";


@Injectable({ providedIn: 'root' })
export class BlockInformationsService {

  public addBlockInformations(content: Array<any>): any {
    const widthsColumns = ['auto', '*'];

    let body = new Array<Array<Cell>>();

    const row = new Array<Cell>();

    const cell1 = new Cell();
    cell1.image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAWgBaAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAAhACEDAREAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAABQcAAgYIA//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAXIBTyCQ0hRmzKAAXpszfmWLCKHKASoSHAQ5yMqdbkP/xAAiEAACAQMEAgMAAAAAAAAAAAAEBQYCAwcAARAXFDQWNTb/2gAIAQEAAQUCkkkviF/ArRVuzAVdYySQHCNdY/t+fbkp9a5RFL4hUdyCu3Mjfb9nWN69hlTz6XHv4yfMNl8U6fJ1IEhwjYp9F5fQIxhsLrWLD5O34y/62H/e4//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQMBAT8BT//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQIBAT8BT//EADcQAAEDAgMDBwoHAAAAAAAAAAIBAwQABRESISIxcRATFDJhofAGJDNBQlJygZLBNFFTc3Sy4f/aAAgBAQAGPwJm1WplJV3kJmRC6jAe+fj/AE3/ACgucm5uYZjQnVaYDgKbqCRYbhJt2O0D0SQpgXFFXVKSy30BSYQ5o0tv0clE38C8cauN9cXO/cJB5SX2WhXKI91POjbyuQYYOMiSJsYaquPqqC7BjdDimGIMp7OuvfT0lrAZcDztlz3VDVe7Gvw4/VUq0rsvW6U40Qr+SkqiXz+1T/47n9Vq1ftfdan6Z3ZAdGbBN5Eemnevyre39VBfbKgnMQebkxCXBJIcfUSeO1uLekWHIZ2ljTSJhQXjolGdudA5DyZeaiOlII+zeqUxeLwx0OLG1hW8usi/qH29nheSP8K0vwLy/wD/xAAkEAACAQMCBgMAAAAAAAAAAAABEQAhQVEQMSBhcYGR8aGx8P/aAAgBAQABPyFn/I4hMLYF/AgFWlCRFXQgy1dCGuHm3gHKYh53ga2YrFx9U0DohaVJdk3xiEAYq8xZhKIPeDCUGt5Jz3F3ceKwvzKXZRlYnsUB6aMknpEYqCUQOSGQcuXJC5AKNHBh6IXpdAoemFBPDs/wjuJ57CCiLFKzQQoXlTPGFF+nYhstX4GeCv8A/9oADAMBAAIAAwAAABCCSSCQACQCSQSf/8QAFBEBAAAAAAAAAAAAAAAAAAAAQP/aAAgBAwEBPxBP/8QAFBEBAAAAAAAAAAAAAAAAAAAAQP/aAAgBAgEBPxBP/8QAHhABAQEAAgMAAwAAAAAAAAAAAREhAEEQMVEgYfD/2gAIAQEAAT8QfzxIFfYgXA1D3zMJCSCjAiGoINC80cU8xhIxETSIspyUym+KEAXYh7gL8C9MhJ0cw6HsLrXChkyC3MgKBM5KkBsqixQ7fU0dXjrLrCcRd01Yhox4EB37kcQ+V3dJiKVSFDXkSYijpwZFuGLT7kWNReJiDafiAWAAvQLFydh2eACbp6G0RoziE9IhQtWoVay7xzKM0kOpggsC8E38A38r9ef/2Q==';
    cell1.width = 20;
    cell1.height = 20;
    row.push(cell1);

    const cell2 = new Cell();
    cell2.text = 'Le montant total de la simulation ne prend pas en compte les allocations logement, familiales, autres ressources du foyer et le prélèvement à la source.';
    const style = new Style();
    style.color = '#23333C';
    style.fontSize = 12;
    cell2.style = style;
    row.push(cell2);

    body.push(row);

    const table = new Table(widthsColumns, body);
    const tableElement = new TableElement(table, 'tableStyle1', 'headerLineOnly');

    content.push(tableElement);
  }
}