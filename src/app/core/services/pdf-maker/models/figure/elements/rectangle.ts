export class Rectangle {

  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  lineColor: string;

  constructor(x: number, y: number, w: number, h: number, r: number, lineColor: string) {
    this.type = 'rect';
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = r;
    this.lineColor = lineColor;
  }
}
