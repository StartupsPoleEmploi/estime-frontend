import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-aides-carte-headers',
  templateUrl: './aides-carte-headers.component.html',
  styleUrls: ['./aides-carte-headers.component.scss']
})
export class AidesCarteHeadersComponent implements OnInit {
  @Input() aideIcon: String;
  @Input() aideTitre: String;
  @Input() aideColor: String;
  constructor() { }

  ngOnInit(): void {
  }

}
