import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceCommaByDot'
})
export class ReplaceCommaByDotPipe implements PipeTransform {

  transform(value: string): string {
    if (value !== undefined && value !== null) {
      return value.replace(/,/g, ".");
    } else {
      return "";
    }
  }
}