export class Line {

  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lineWidth: number;
  lineColor: string

  constructor( x1: number,  y1: number,  x2: number,  y2: number, lineWidth: number, lineColor: string) {
    this.type = 'line';
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
  }
}
