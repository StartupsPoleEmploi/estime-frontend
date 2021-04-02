import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { BrutNetService } from '@app/core/services/utile/brut-net.service';
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
  isFuturTravailSalaireFormSubmitted = false;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  typesContratTavailEnum: typeof TypesContratTavailEnum = TypesContratTavailEnum;
  messageErreurSalaire: string;

  question_icon_1: String = '';
  question_icon_2: String = '';

  nombreMoisCDDSelectOptions = [
    { label: "1 mois", value: 1 },
    { label: "2 mois", value: 2 },
    { label: "3 mois", value: 3 },
    { label: "4 mois", value: 4 },
    { label: "5 mois", value: 5 },
    { label: "6 mois et plus", value: 6 }
  ];

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private deConnecteService: DeConnecteService,
    private elementRef: ElementRef,
    private brutNetService: BrutNetService,
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
    this.isFuturTravailSalaireFormSubmitted = true;
    if(this.isDonneesSaisiesValides(form)) {
      this.deConnecteService.setFuturTravail(this.futurTravail);
      this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.MA_SITUATION]);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  public unsetNombreMoisContrat(typeContrat: string): void {
    if(typeContrat === this.typesContratTavailEnum.CDI) {
      this.futurTravail.nombreMoisContratCDD = null;
    }
  }

  public calculSalaireMensuelNet() {
    this.isFuturTravailSalaireFormSubmitted = false;
    if(this.futurTravail.salaireMensuelBrut >= 100 && this.futurTravail.salaireMensuelBrut != null) {
      this.futurTravail.salaireMensuelNet = this.brutNetService.getNetFromBrut(this.futurTravail.salaireMensuelBrut);
    } else {
      this.futurTravail.salaireMensuelNet = undefined;
    }
  }

  public calculSalaireMensuelBrut() {
    this.isFuturTravailSalaireFormSubmitted = false;
    if(this.futurTravail.salaireMensuelNet >= 57 && this.futurTravail.salaireMensuelNet != null) {
      this.futurTravail.salaireMensuelBrut = this.brutNetService.getBrutFromNet(this.futurTravail.salaireMensuelNet);
    } else {
      this.futurTravail.salaireMensuelBrut = undefined;
    }
  }

  private isDonneesSaisiesValides(form: FormGroup): boolean {
    return form.valid
           && this.futurTravail.salaireMensuelBrut > 0
           && this.futurTravail.salaireMensuelNet > 0
           && !this.isNombreHeuresTravailleesSemaineInvalide()
  }

  private isNombreHeuresTravailleesSemaineInvalide(): boolean {
    return this.futurTravail.nombreHeuresTravailleesSemaine && this.futurTravail.nombreHeuresTravailleesSemaine == 0 || this.futurTravail.nombreHeuresTravailleesSemaine > this.controleChampFormulaireService.MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX;
  }



  /************ gestion évènements press enter ************************/

  public handleKeyUpOnButtonTypeContrat(event: any, typeContrat: string) {
    if (event.keyCode === 13) {
      this.futurTravail.typeContrat = typeContrat;
    }
  }

  public onMouseOverInfobulle(numero_infobulle) {
    if(numero_infobulle == 1) this.question_icon_1 = '_hover';
    if(numero_infobulle == 2) this.question_icon_2 = '_hover';
  }

  public onMouseLeaveInfobulle(numero_infobulle) {
    if(numero_infobulle == 1) this.question_icon_1 = '';
    if(numero_infobulle == 2) this.question_icon_2 = '';
  }
  public onClickInfobulle(numero_infobulle) {
    if(numero_infobulle == 1) this.question_icon_1 = '_click';
    if(numero_infobulle == 2) this.question_icon_2 = '_click';
  }
}
