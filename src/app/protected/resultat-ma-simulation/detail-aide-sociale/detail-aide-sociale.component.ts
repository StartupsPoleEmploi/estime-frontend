import { Component, OnInit, Input } from '@angular/core';
import { AideSociale } from '@models/aide-sociale';

@Component({
  selector: 'app-detail-aide-sociale',
  templateUrl: './detail-aide-sociale.component.html',
  styleUrls: ['./detail-aide-sociale.component.scss']
})
export class DetailAideSocialeComponent implements OnInit {

  @Input() aideSocialeSelected: AideSociale;

  constructor() { }

  ngOnInit(): void {
  }

}
