export class Text {

  text: string;
  style: any;
  margin: Array<any>;

  constructor(text: string, style: any, margin: Array<any>) {
    this.text = text;
    this.style = style;
    this.margin = margin;
  }
}
