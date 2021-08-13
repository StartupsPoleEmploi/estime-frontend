import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consultation-offres',
  templateUrl: './consultation-offres.component.html',
  styleUrls: ['./consultation-offres.component.scss']
})
export class ConsultationOffresComponent implements OnInit {
  stickyButton = false;

  constructor() { }

  btnClick = function(){
    window.open('https://candidat.pole-emploi.fr/offres/emploi', '_blank');
  }

  ngOnInit(): void {
  }

}
