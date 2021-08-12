import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inscription-atelier',
  templateUrl: './inscription-atelier.component.html',
  styleUrls: ['./inscription-atelier.component.scss']
})
export class InscriptionAtelierComponent implements OnInit {
  stickyButton = false;

  constructor() { }

  btnClick = function(){
    window.open('https://candidat.pole-emploi.fr/prestations/servicescarte', '_blank');
  }

  ngOnInit(): void {
  }

}
