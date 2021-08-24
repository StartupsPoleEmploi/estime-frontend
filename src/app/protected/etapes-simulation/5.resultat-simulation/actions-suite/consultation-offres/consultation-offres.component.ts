import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-consultation-offres',
  templateUrl: './consultation-offres.component.html',
  styleUrls: ['./consultation-offres.component.scss']
})
export class ConsultationOffresComponent implements OnInit {
  @Input() onClickButtonVoirOffres: () => void;
  stickyButton = false;

  constructor() { }

  ngOnInit(): void {
  }

}
