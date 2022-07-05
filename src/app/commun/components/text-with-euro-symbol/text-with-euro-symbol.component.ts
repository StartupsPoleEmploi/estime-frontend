import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-text-with-euro-symbol',
  templateUrl: './text-with-euro-symbol.component.html',
  styleUrls: ['./text-with-euro-symbol.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextWithEuroSymbolComponent {

  @Input() message: string

}
