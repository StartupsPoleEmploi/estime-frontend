import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fil-etapes-mobile',
  templateUrl: './fil-etapes-mobile.component.html',
  styleUrls: ['./fil-etapes-mobile.component.scss']
})
export class FilEtapesMobileComponent implements OnInit {

  @Input()
  etapeActive: number;

  constructor() { }

  ngOnInit(): void {
  }

}
