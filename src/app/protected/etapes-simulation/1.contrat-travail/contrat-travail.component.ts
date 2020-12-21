import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { TypesContratTavailEnum } from "@enumerations/types-contrat-travail.enum";
import { FuturTravail } from '@models/futur-travail';

@Component({
  selector: 'app-contrat-travail',
  templateUrl: './contrat-travail.component.html',
  styleUrls: ['./contrat-travail.component.scss']
})
export class ContratTravailComponent implements OnInit {

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

  @Output() validationEtapeEventEmitter = new EventEmitter<void>();

  constructor(
    private deConnecteService: DeConnecteService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    private router: Router
    ) {

  }

  ngOnInit(): void {
    this.loadDataFuturTravail();
  }

  private loadDataFuturTravail(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.futurTravail) {
      this.futurTravail = demandeurEmploiConnecte.futurTravail;
    } else {
      this.futurTravail =  new FuturTravail();
      this.futurTravail.nombreMoisContratCDD = null;
    }
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }

  public onSubmitFuturTravailForm(form: FormGroup): void {
    this.isFuturTravailFormSubmitted = true;
    if(form.valid) {
      this.deConnecteService.setFuturTravail(this.futurTravail);
      this.validationEtapeEventEmitter.emit();
    }
  }

  public unsetNombreMoisContrat(typeContrat: string): void {
    if(typeContrat === this.typesContratTavailEnum.CDI) {
      this.futurTravail.nombreMoisContratCDD = null;
    }
  }


  /************ gestion évènements press enter ************************/

  public handleKeyUpOnButtonTypeContrat(event: any, typeContrat: string) {
    if (event.keyCode === 13) {
      this.futurTravail.typeContrat = typeContrat;
    }
  }
}
