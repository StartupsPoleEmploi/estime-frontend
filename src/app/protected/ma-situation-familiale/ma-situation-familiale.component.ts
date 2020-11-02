import { Component, OnInit, ElementRef } from '@angular/core';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Personne } from '@app/commun/models/personne';
import { RessourcesFinancieres } from '@app/commun/models/ressources-financieres';

@Component({
  selector: 'app-ma-situation-familiale',
  templateUrl: './ma-situation-familiale.component.html',
  styleUrls: ['./ma-situation-familiale.component.scss']
})
export class MaSituationFamilialeComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
  }

  redirectVersPagePrecedente() {
    this.router.navigate([RoutesEnum.MES_INFORMATIONS_IDENTITE], { replaceUrl: true });
  }

  redirectVersPageSuivante() {
    console.log(this.demandeurEmploiConnecte);
    this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    if(this.demandeurEmploiConnecte.situationFamiliale.nombrePersonnesACharge > 0) {
      this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
    } else {
      this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
    }
  }





}
