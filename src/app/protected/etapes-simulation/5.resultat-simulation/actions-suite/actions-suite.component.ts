import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-actions-suite',
  templateUrl: './actions-suite.component.html',
  styleUrls: ['./actions-suite.component.scss']
})
export class ActionsSuiteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public onClickButtonMettreAJourProfil(): void {
    window.open('https://candidat.pole-emploi.fr/profil-professionnel/#/profil/synthese', '_blank');
  }

  public onClickButtonInscriptionAtelier(): void {
    window.open('https://candidat.pole-emploi.fr/prestations/servicescarte', '_blank');
  }

  public onClickButtonVoirOffres(): void {
    window.open('https://candidat.pole-emploi.fr/offres/emploi', '_blank');
  }

}
