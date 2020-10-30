import { Component, OnInit } from '@angular/core';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { Router } from '@angular/router';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';

@Component({
  selector: 'app-mes-ressources-financieres',
  templateUrl: './mes-ressources-financieres.component.html',
  styleUrls: ['./mes-ressources-financieres.component.scss']
})
export class MesRessourcesFinancieresComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;

  nombreMoisCumulAssSalaireSelectOptions = [
    { label: "1 mois", value: 1, default: true },
    { label: "2 mois", value: 2, default: false },
    { label: "3 mois", value: 3, default: false }
  ];

  constructor(
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
  }

  redirectVersPagePrecedente() {
    if(this.demandeurEmploiConnecte.situationFamiliale.nombrePersonnesACharge > 0) {
      this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
    } else {
      this.router.navigate([RoutesEnum.MA_SITUATION_FAMILIALE], { replaceUrl: true });
    }
  }

  redirectVersPageSuivante() {
    console.log(this.demandeurEmploiConnecte);
    this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    this.router.navigate([RoutesEnum.RESULAT_MA_SIMULATION], { replaceUrl: true });
  }

  setNombreMoisCumulesASSPercueEtSalaire(hasASSPlusSalaireCumule: boolean) {
    if(hasASSPlusSalaireCumule) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesASSPercueEtSalaire = 1;
    } else {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesASSPercueEtSalaire = 0;
    }
  }

}
