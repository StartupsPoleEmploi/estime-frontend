import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { TypesContratTavailEnum } from "@enumerations/types-contrat-travail.enum";
import { FormGroup } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { FuturTravail } from '@app/commun/models/futur-travail';

@Component({
  selector: 'app-mon-futur-travail',
  templateUrl: './mon-futur-travail.component.html',
  styleUrls: ['./mon-futur-travail.component.scss']
})
export class MonFuturTravailComponent implements OnInit {

  futurTravail: FuturTravail;
  isFuturTravailFormSubmitted = false;
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
    this.loadDataFuturTravail();
  }

  private loadDataFuturTravail(): void {
    const demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.futurTravail) {
      this.futurTravail = demandeurEmploiConnecte.futurTravail;
    } else {
      this.futurTravail =  new FuturTravail();
      this.futurTravail.nombreMoisContratCDD = null;
    }
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
  }

  public onSubmitFuturTravailForm(form: FormGroup): void {
    this.isFuturTravailFormSubmitted = true;
    if(form.valid) {
      this.demandeurEmploiConnecteService.setFuturTravail(this.futurTravail);
      this.router.navigate([RoutesEnum.MES_INFORMATIONS_PERSONNELLES], { replaceUrl: true });
    }
  }

  public unsetNombreMoisContrat(typeContrat: string): void {
    if(typeContrat === this.typesContratTavailEnum.CDI) {
      this.futurTravail.nombreMoisContratCDD = null;
    }
  }
}
