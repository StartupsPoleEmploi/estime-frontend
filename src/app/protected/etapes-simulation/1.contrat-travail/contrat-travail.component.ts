import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { Salaire } from '@app/commun/models/salaire';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { AidesService } from '@app/core/services/utile/aides.service';
import { BrutNetService } from '@app/core/services/utile/brut-net.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { TypesContratTavailEnum } from '@enumerations/types-contrat-travail.enum';
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
  isNombreTrajetsDomicileTravailDisplay = false;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  typesContratTavailEnum: typeof TypesContratTavailEnum = TypesContratTavailEnum;
  messageErreurSalaire: string;

  nombreMoisCDDSelectOptions = [
    { label: "1 mois", value: 1 },
    { label: "2 mois", value: 2 },
    { label: "3 mois", value: 3 },
    { label: "4 mois", value: 4 },
    { label: "5 mois", value: 5 },
    { label: "6 mois et plus", value: 6 }
  ];

  constructor(
    private aidesService: AidesService,
    private brutNetService: BrutNetService,
    private deConnecteService: DeConnecteService,
    private elementRef: ElementRef,
    private router: Router,
    public screenService: ScreenService,
    public controleChampFormulaireService: ControleChampFormulaireService
  ) {

  }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    this.loadDataFuturTravail();
  }

  private loadDataFuturTravail(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.futurTravail) {
      this.futurTravail = demandeurEmploiConnecte.futurTravail;
      if(this.futurTravail.nombreTrajetsDomicileTravail) {
        this.isNombreTrajetsDomicileTravailDisplay = true;
      }
    } else {
      this.futurTravail = new FuturTravail();
      this.futurTravail.nombreMoisContratCDD = null;
      this.futurTravail.salaire = new Salaire();
      this.futurTravail.salaire.montantBrut = null;
      this.futurTravail.salaire.montantNet = null;
    }
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }

  public onSubmitFuturTravailForm(form: FormGroup): void {
    this.isFuturTravailFormSubmitted = true;
    this.isFuturTravailSalaireFormSubmitted = true;
    if (this.isDonneesSaisiesValides(form)) {
      this.deConnecteService.setFuturTravail(this.futurTravail);
      this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.MA_SITUATION]);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  public unsetNombreMoisContrat(typeContrat: string): void {
    if (typeContrat === this.typesContratTavailEnum.CDI) {
      this.futurTravail.nombreMoisContratCDD = null;
    }
  }

  public calculSalaireMensuelNet() {
    this.isFuturTravailSalaireFormSubmitted = false;
    if (this.futurTravail.salaire.montantBrut >= 100 && this.futurTravail.salaire.montantBrut != null) {
      this.futurTravail.salaire.montantNet = this.brutNetService.getNetFromBrut(this.futurTravail.salaire.montantBrut);
    } else {
      this.futurTravail.salaire.montantNet = undefined;
    }
  }

  public calculSalaireMensuelBrut() {
    this.isFuturTravailSalaireFormSubmitted = false;
    if (this.futurTravail.salaire.montantNet >= 57 && this.futurTravail.salaire.montantNet != null) {
      this.futurTravail.salaire.montantBrut = this.brutNetService.getBrutFromNet(this.futurTravail.salaire.montantNet);
    } else {
      this.futurTravail.salaire.montantBrut = undefined;
    }
  }

  private isDonneesSaisiesValides(form: FormGroup): boolean {
    return form.valid
      && this.futurTravail.salaire.montantBrut > 0
      && this.futurTravail.salaire.montantNet > 0
      && !this.isNombreHeuresTravailleesSemaineInvalide()
  }

  private isNombreHeuresTravailleesSemaineInvalide(): boolean {
    return this.futurTravail.nombreHeuresTravailleesSemaine && this.futurTravail.nombreHeuresTravailleesSemaine == 0 || this.futurTravail.nombreHeuresTravailleesSemaine > this.controleChampFormulaireService.MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX;
  }

  public handleKeyUpOnButtonTypeContrat(event: any, typeContrat: string) {
    if (event.keyCode === 13) {
      this.futurTravail.typeContrat = typeContrat;
    }
  }

  public handleAffichageNombreTrajetsDomicileTravail() {
    this.isNombreTrajetsDomicileTravailDisplay = this.aidesService.isEligibleAideMobilite(
      this.deConnecteService.getDemandeurEmploiConnecte(),
      this.futurTravail.distanceKmDomicileTravail);

    if (!this.isNombreTrajetsDomicileTravailDisplay) {
      this.futurTravail.nombreTrajetsDomicileTravail = null;
    }
  }
}
