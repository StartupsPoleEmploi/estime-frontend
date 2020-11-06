import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { TypesContratTavailEnum } from "@enumerations/types-contrat-travail.enum";
import { FormGroup } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';

@Component({
  selector: 'app-mon-futur-travail',
  templateUrl: './mon-futur-travail.component.html',
  styleUrls: ['./mon-futur-travail.component.scss']
})
export class MonFuturTravailComponent implements OnInit {

  isFuturTravailFormSubmitted = false;
  demandeurEmploiConnecte: DemandeurEmploi;
  typesContratTavailEnum: typeof TypesContratTavailEnum = TypesContratTavailEnum;


  nombreMoisCDDSelectOptions = [
    { label: "1 mois", value: 1 },
    { label: "2 mois", value: 2 },
    { label: "3 mois", value: 3 },
    { label: "4 mois", value: 4 },
    { label: "5 mois", value: 5 },
    { label: "6 mois et plus", value: 6 }
  ];

  constructor(
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    private router: Router
    ) {

  }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
  }

  redirectVersPageSuivante(form: FormGroup) {
    this.isFuturTravailFormSubmitted = true;
    if(form.valid) {
      this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      this.router.navigate([RoutesEnum.MES_INFORMATIONS_PERSONNELLES], { replaceUrl: true });
    }
  }


  redirectVersPagePrecedente() {
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
  }

  unsetNombreMoisContrat(typeContrat: string) {
    if(typeContrat === this.typesContratTavailEnum.CDI) {
      this.demandeurEmploiConnecte.futurTravail.nombreMoisContratCDD = null;
    }
  }
}
