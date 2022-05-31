import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { Salaire } from '@app/commun/models/salaire';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { AidesService } from '@app/core/services/utile/aides.service';
import { BrutNetService } from '@app/core/services/utile/brut-net.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { ModalService } from '@app/core/services/utile/modal.service';
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

  private static DISTANCE_MINI_AIDE_MOB = 10;

  @ViewChild('futurTravailForm', { read: NgForm }) futurTravailForm: FormGroup;
  @Input() isModificationCriteres: boolean;

  futurTravail: FuturTravail;
  isFuturTravailFormSubmitted = false;
  isFuturTravailSalaireFormSubmitted = false;
  isNombreTrajetsDomicileTravailDisplay = false;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  typesContratTavailEnum: typeof TypesContratTavailEnum = TypesContratTavailEnum;
  messageErreurSalaire: string;
  hasOffreEmploiOui: boolean;
  hasOffreEmploiNon: boolean;
  isTypeContratCDI: boolean;
  isTypeContratCDD: boolean;
  typeSalaireDisplay: string;

  isDureeHebdoTempsPlein: boolean;
  isDureeHebdoMiTemps: boolean;
  isDureeHebdoAutre: boolean;
  isSalaireSouhaiteSMIC: boolean;
  isSalaireSouhaiteAutre: boolean;

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
    public screenService: ScreenService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    public modalService: ModalService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    this.loadDataFuturTravail();
    this.typeSalaireDisplay = 'net';
  }

  private loadDataFuturTravail(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.futurTravail) {
      this.futurTravail = demandeurEmploiConnecte.futurTravail;
      if (this.futurTravail.nombreTrajetsDomicileTravail) {
        this.isNombreTrajetsDomicileTravailDisplay = true;
      }
      this.hasOffreEmploiOui = this.futurTravail.hasOffreEmploiEnVue;
      this.hasOffreEmploiNon = !this.futurTravail.hasOffreEmploiEnVue;
      this.isTypeContratCDI = this.futurTravail.typeContrat == this.typesContratTavailEnum.CDI;
      this.isTypeContratCDD = this.futurTravail.typeContrat == this.typesContratTavailEnum.CDD;
      this.isDureeHebdoTempsPlein = this.futurTravail.dureeHebdoTempsPlein;
      this.isDureeHebdoMiTemps = this.futurTravail.dureeHebdoMiTemps;
      this.isDureeHebdoAutre = this.futurTravail.dureeHebdoAutre;
      this.isSalaireSouhaiteSMIC = this.futurTravail.salaireSouhaiteSMIC;
      this.isSalaireSouhaiteAutre = this.futurTravail.salaireSouhaiteAutre;
    } else {
      this.futurTravail = new FuturTravail();
      this.futurTravail.nombreMoisContratCDD = null;
      this.futurTravail.salaire = new Salaire();
      this.futurTravail.salaire.montantBrut = null;
      this.futurTravail.salaire.montantNet = null;
      this.futurTravail.hasOffreEmploiEnVue = null;
    }
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }

  public onSubmitFuturTravailForm(): void {
    this.isFuturTravailFormSubmitted = true;
    this.isFuturTravailSalaireFormSubmitted = true;
    this.propagateSalaire();
    if (this.isDonneesSaisiesValides(this.futurTravailForm)) {
      if (!this.afficherNombreTrajetsDomicileTravail()) this.futurTravail.nombreTrajetsDomicileTravail = 0;
      this.deConnecteService.setFuturTravail(this.futurTravail);
      if (!this.isModificationCriteres) this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.MA_SITUATION]);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  private isDonneesSaisiesValides(form: FormGroup): boolean {
    return form.valid
      && this.futurTravail.salaire.montantBrut > 0
      && this.futurTravail.salaire.montantNet > 0
      && !this.isNombreHeuresTravailleesSemaineInvalide()
      && !this.isTypeContratInvalide()
      && !this.isDureeHebdoInvalide()
      && !this.isSalaireSouhaiteInvalide();
  }

  private isNombreHeuresTravailleesSemaineInvalide(): boolean {
    return this.futurTravail.nombreHeuresTravailleesSemaine && this.futurTravail.nombreHeuresTravailleesSemaine == 0 || this.futurTravail.nombreHeuresTravailleesSemaine > this.controleChampFormulaireService.MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX;
  }

  private isTypeContratInvalide(): boolean {
    return this.futurTravail.typeContrat == null || (this.isTypeContratCDI && this.isTypeContratCDD);
  }

  public isDureeHebdoInvalide(): boolean {
    return this.hasOffreEmploiNon && (
      (this.isDureeHebdoTempsPlein == null && this.isDureeHebdoMiTemps == null && this.isDureeHebdoAutre == null)
      || (this.isDureeHebdoTempsPlein && this.isDureeHebdoMiTemps && this.isDureeHebdoAutre)
    );
  }

  public isSalaireSouhaiteInvalide(): boolean {
    return this.hasOffreEmploiNon && (
      (this.isSalaireSouhaiteSMIC == null && this.isSalaireSouhaiteAutre == null)
      || (this.isSalaireSouhaiteSMIC && this.isSalaireSouhaiteAutre)
    );
  }
  public onClickCheckBoxHasOffreEmploiOui() {
    if (this.hasOffreEmploiOui) {
      this.hasOffreEmploiNon = false;
      this.futurTravail.hasOffreEmploiEnVue = true;
    } else {
      this.futurTravail.hasOffreEmploiEnVue = null;
    }
  }

  public onClickCheckBoxHasOffreEmploiNon() {
    if (this.hasOffreEmploiNon) {
      this.hasOffreEmploiOui = false;
      this.futurTravail.hasOffreEmploiEnVue = false;
      this.futurTravail.typeContrat = TypesContratTavailEnum.CDI;
    } else {
      this.futurTravail.hasOffreEmploiEnVue = null;
    }
  }

  public onClickCheckBoxIsTypeContratCDI() {
    if (this.isTypeContratCDI) {
      this.isTypeContratCDD = false;
      this.futurTravail.typeContrat = this.typesContratTavailEnum.CDI;
      this.unsetNombreMoisContrat();
    } else {
      this.futurTravail.typeContrat = null;
    }
  }

  public onClickCheckBoxIsTypeContratCDD() {
    if (this.isTypeContratCDD) {
      this.isTypeContratCDI = false;
      this.futurTravail.typeContrat = this.typesContratTavailEnum.CDD;
    } else {
      this.futurTravail.typeContrat = null;
      this.unsetNombreMoisContrat();
    }
  }

  public onClickCheckBoxIsDureeHebdoTempsPlein() {
    if (this.isDureeHebdoTempsPlein) {
      this.setDureeHebdoTempsPlein();
    } else {
      this.unsetDureeHebdoTempsPlein();
    }
  }

  public onClickCheckBoxIsDureeHebdoMiTemps() {
    if (this.isDureeHebdoMiTemps) {
      this.setDureeHebdoMiTemps();
    } else {
      this.unsetDureeHebdoMiTemps();
    }
  }

  public onClickCheckBoxIsDureeHebdoAutre() {
    if (this.isDureeHebdoAutre) {
      this.setDureeHebdoAutre();
    } else {
      this.unsetDureeHebdoAutre();
    }
  }

  public onClickCheckBoxIsSalaireSouhaiteSMIC() {
    if (this.isSalaireSouhaiteSMIC) {
      this.setSalaireSouhaiteSMIC();
    } else {
      this.unsetSalaireSouhaiteSMIC();
    }
  }

  public onClickCheckBoxIsSalaireSouhaiteAutre() {
    if (this.isSalaireSouhaiteAutre) {
      this.setSalaireSouhaiteAutre();
    } else {
      this.unsetSalaireSouhaiteAutre();
    }
  }

  public handleKeyUpOnButtonOffreEmploiOui(event: any) {
    if (event.keyCode === 13) {
      this.hasOffreEmploiOui = !this.hasOffreEmploiOui;
      this.onClickCheckBoxHasOffreEmploiOui();
    }
  }

  public handleKeyUpOnButtonOffreEmploiNon(event: any) {
    if (event.keyCode === 13) {
      this.hasOffreEmploiNon = !this.hasOffreEmploiNon;
      this.onClickCheckBoxHasOffreEmploiNon();
    }
  }

  public handleKeyUpOnButtonIsTypeContratCDI(event: any) {
    if (event.keyCode === 13) {
      this.isTypeContratCDI = !this.isTypeContratCDI;
      this.onClickCheckBoxIsTypeContratCDI();
    }
  }

  public handleKeyUpOnButtonIsTypeContratCDD(event: any) {
    if (event.keyCode === 13) {
      this.isTypeContratCDD = !this.isTypeContratCDD;
      this.onClickCheckBoxIsTypeContratCDD();
    }
  }

  public handleKeyUpOnButtonIsDureeHebdoTempsPlein(event: any) {
    if (event.keyCode === 13) {
      this.isDureeHebdoTempsPlein = !this.isDureeHebdoTempsPlein;
      this.onClickCheckBoxIsDureeHebdoTempsPlein();
    }
  }

  public handleKeyUpOnButtonIsDureeHebdoMiTemps(event: any) {
    if (event.keyCode === 13) {
      this.isDureeHebdoMiTemps = !this.isDureeHebdoMiTemps;
      this.onClickCheckBoxIsDureeHebdoMiTemps();
    }
  }

  public handleKeyUpOnButtonIsDureeHebdoAutre(event: any) {
    if (event.keyCode === 13) {
      this.isDureeHebdoAutre = !this.isDureeHebdoAutre;
      this.onClickCheckBoxIsDureeHebdoAutre();
    }
  }

  public handleKeyUpOnButtonIsSalaireSouhaiteSMIC(event: any) {
    if (event.keyCode === 13) {
      this.isSalaireSouhaiteSMIC = !this.isSalaireSouhaiteSMIC;
      this.onClickCheckBoxIsSalaireSouhaiteSMIC();
    }
  }

  public handleKeyUpOnButtonIsSalaireSouhaiteAutre(event: any) {
    if (event.keyCode === 13) {
      this.isSalaireSouhaiteAutre = !this.isSalaireSouhaiteAutre;
      this.onClickCheckBoxIsSalaireSouhaiteAutre();
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

  public calculSalaireMensuelNet() {
    this.isFuturTravailSalaireFormSubmitted = false;
    if (this.futurTravail.salaire.montantBrut >= 100 && this.futurTravail.salaire.montantBrut != null) {
      this.futurTravail.salaire.montantNet = this.brutNetService.getNetFromBrut(this.futurTravail.salaire.montantBrut, this.futurTravail.typeContrat, this.futurTravail.nombreHeuresTravailleesSemaine);

    } else {
      this.futurTravail.salaire.montantNet = undefined;
    }
  }

  public calculSalaireMensuelBrut() {
    this.isFuturTravailSalaireFormSubmitted = false;
    if (this.futurTravail.salaire.montantNet >= 57 && this.futurTravail.salaire.montantNet != null) {
      this.futurTravail.salaire.montantBrut = this.brutNetService.getBrutFromNet(this.futurTravail.salaire.montantNet, this.futurTravail.typeContrat, this.futurTravail.nombreHeuresTravailleesSemaine);

    } else {
      this.futurTravail.salaire.montantBrut = undefined;
    }
  }

  private propagateSalaire() {
    if (this.hasOffreEmploiNon) {
      if (this.isSalaireSouhaiteSMIC) {
        this.setSalaireSouhaiteSMIC();
      } else if (this.isSalaireSouhaiteAutre) {
        this.setSalaireSouhaiteAutre();
      }
    }
  }

  public getMontantSmicMensuelNet() {
    return this.brutNetService.getSmicMensuelNetFromNombreHeure(this.futurTravail.nombreHeuresTravailleesSemaine)
  }

  public afficherNombreTrajetsDomicileTravail(): boolean {
    return this.futurTravail.distanceKmDomicileTravail >= ContratTravailComponent.DISTANCE_MINI_AIDE_MOB;
  }

  public unsetNombreMoisContrat(): void {
    this.futurTravail.nombreMoisContratCDD = null;
  }

  public setDureeHebdoTempsPlein() {
    this.isDureeHebdoMiTemps = false;
    this.isDureeHebdoAutre = false;
    this.futurTravail.dureeHebdoTempsPlein = true;
    this.futurTravail.dureeHebdoMiTemps = false;
    this.futurTravail.dureeHebdoAutre = false;
    this.futurTravail.nombreHeuresTravailleesSemaine = 35;
  }

  public unsetDureeHebdoTempsPlein() {
    this.futurTravail.dureeHebdoTempsPlein = false;
    this.futurTravail.nombreHeuresTravailleesSemaine = null;
  }

  public setDureeHebdoMiTemps() {
    this.isDureeHebdoTempsPlein = false;
    this.isDureeHebdoAutre = false;
    this.futurTravail.dureeHebdoMiTemps = true;
    this.futurTravail.dureeHebdoTempsPlein = false;
    this.futurTravail.dureeHebdoAutre = false;
    this.futurTravail.nombreHeuresTravailleesSemaine = 20;
  }

  public unsetDureeHebdoMiTemps() {
    this.futurTravail.dureeHebdoMiTemps = false;
    this.futurTravail.nombreHeuresTravailleesSemaine = null;
  }

  public setDureeHebdoAutre() {
    this.isDureeHebdoTempsPlein = false;
    this.isDureeHebdoMiTemps = false;
    this.futurTravail.dureeHebdoAutre = true;
    this.futurTravail.dureeHebdoTempsPlein = false;
    this.futurTravail.dureeHebdoMiTemps = false;
    this.futurTravail.nombreHeuresTravailleesSemaine = null;
  }

  public unsetDureeHebdoAutre() {
    this.futurTravail.dureeHebdoAutre = false;
    this.futurTravail.nombreHeuresTravailleesSemaine = null;
  }

  public setSalaireSouhaiteSMIC() {
    this.isSalaireSouhaiteAutre = false;
    this.futurTravail.salaireSouhaiteSMIC = true;
    this.futurTravail.salaireSouhaiteAutre = false;
    this.futurTravail.salaire.montantNet = this.getMontantSmicMensuelNet();
    this.futurTravail.salaire.montantBrut = this.brutNetService.getBrutFromNet(this.futurTravail.salaire.montantNet, this.futurTravail.typeContrat, this.futurTravail.nombreHeuresTravailleesSemaine);
  }

  public unsetSalaireSouhaiteSMIC() {
    this.futurTravail.salaireSouhaiteSMIC = false;
    this.futurTravail.salaire.montantNet = null;
    this.futurTravail.salaire.montantBrut = null;
  }

  public setSalaireSouhaiteAutre() {
    this.isSalaireSouhaiteSMIC = false;
    this.futurTravail.salaireSouhaiteAutre = true;
    this.futurTravail.salaireSouhaiteSMIC = false;
  }

  public unsetSalaireSouhaiteAutre() {
    this.futurTravail.dureeHebdoTempsPlein = false;
    this.futurTravail.salaire.montantNet = null;
    this.futurTravail.salaire.montantBrut = null;
  }
}
