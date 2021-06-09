import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-text-with-euro-symbol',
  templateUrl: './text-with-euro-symbol.component.html',
  styleUrls: ['./text-with-euro-symbol.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextWithEuroSymbolComponent implements OnInit {

  @Input() message : string

  constructor() { }

  ngOnInit(): void {
  }

}
