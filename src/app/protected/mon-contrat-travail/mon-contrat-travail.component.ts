import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { FuturTravail } from '@app/commun/models/futur-travail';

@Component({
  selector: 'app-mon-contrat-travail',
  templateUrl: './mon-contrat-travail.component.html',
  styleUrls: ['./mon-contrat-travail.component.scss']
})
export class MonContratTravailComponent implements OnInit {

  futurTravail: FuturTravail;

  nombreMoisCDDOptions = [
    { label: "1 mois", value: 1 },
    { label: "2 mois", value: 2 },
    { label: "3 mois", value: 3 },
    { label: "4 mois", value: 4 },
    { label: "5 mois", value: 5 },
    { label: "6 mois et plus", value: 6 }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.instancierFuturTravail();
  }

  redirectVersPageSuivante() {
    console.log(this.futurTravail.nombreMoisContrat);
    console.log(this.futurTravail.typeContrat);
  }

  redirectVersPagePrecedente() {
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
  }

  instancierFuturTravail() {
    this.futurTravail = new FuturTravail();
    this.futurTravail.typeContrat = 'CDI';
  }
}
