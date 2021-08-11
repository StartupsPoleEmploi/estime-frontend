import { Component, OnInit, Input } from '@angular/core';
import { Aide } from '@models/aide';

@Component({
  selector: 'app-detail-aide',
  templateUrl: './detail-aide.component.html',
  styleUrls: ['./detail-aide.component.scss']
})
export class DetailAideComponent implements OnInit {

  @Input() aideSelected: Aide;

  constructor() { }

  ngOnInit(): void {
  }

}
