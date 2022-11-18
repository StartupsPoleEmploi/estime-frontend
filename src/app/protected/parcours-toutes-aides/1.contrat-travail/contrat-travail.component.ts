import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { LibellesTypesContratTravailEnum } from '@app/commun/enumerations/libelles-types-contrat-travail.enum';
import { Salaire } from '@app/commun/models/salaire';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { AidesService } from '@app/core/services/utile/aides.service';
import { SalaireService } from '@app/core/services/utile/salaire.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { TypesContratTravailEnum } from '@enumerations/types-contrat-travail.enum';
import { FuturTravail } from '@models/futur-travail';
import { LibellesCourtsTypesContratTravailEnum } from '@app/commun/enumerations/libelles-courts-types-contrat-travail.enum';

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
  TypesContratTravailEnum: typeof TypesContratTravailEnum = TypesContratTravailEnum;
  LibellesTypesContratTravailEnum: typeof LibellesTypesContratTravailEnum = LibellesTypesContratTravailEnum;
  LibellesCourtsTypesContratTravailEnum: typeof LibellesCourtsTypesContratTravailEnum = LibellesCourtsTypesContratTravailEnum
  messageErreurSalaire: string;
  hasOffreEmploiOui: boolean;
  hasOffreEmploiNon: boolean;
  isTypeContratCDI: boolean;
  isTypeContratCDD: boolean;
  isTypeContratInterim: boolean;
  isTypeContratIAE: boolean;
  typeSalaireDisplay: string;

  isDureeHebdoTempsPlein: boolean;
  isDureeHebdoMiTemps: boolean;
  isDureeHebdoAutre: boolean;
  isSalaireSouhaiteSMIC: boolean;
  isSalaireSouhaiteAutre: boolean;

  isNombreTrajets1JourSemaine: boolean;
  isNombreTrajets2JoursSemaine: boolean;
  isNombreTrajets3JoursSemaine: boolean;
  isNombreTrajets4JoursSemaine: boolean;
  isNombreTrajets5JoursSemaine: boolean;

  isDistanceDomicileTravailEntre0Et9: boolean;
  isDistanceDomicileTravailEntre10Et19: boolean;
  isDistanceDomicileTravailEntre20Et30: boolean;
  isDistanceDomicileTravailPlusDe30: boolean;

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
    private salaireService: SalaireService,
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
    this.typeSalaireDisplay = 'mensuel_brut';
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
      this.isTypeContratCDI = this.futurTravail.typeContrat == this.TypesContratTravailEnum.CDI;
      this.isTypeContratCDD = this.futurTravail.typeContrat == this.TypesContratTravailEnum.CDD;
      this.isTypeContratInterim = this.futurTravail.typeContrat == this.TypesContratTravailEnum.INTERIM;
      this.isTypeContratIAE = this.futurTravail.typeContrat == this.TypesContratTravailEnum.IAE;
      this.isDureeHebdoTempsPlein = this.futurTravail.dureeHebdoTempsPlein;
      this.isDureeHebdoMiTemps = this.futurTravail.dureeHebdoMiTemps;
      this.isDureeHebdoAutre = this.futurTravail.dureeHebdoAutre;
      this.isSalaireSouhaiteSMIC = this.futurTravail.salaireSouhaiteSMIC;
      this.isSalaireSouhaiteAutre = this.futurTravail.salaireSouhaiteAutre;
      this.isNombreTrajets1JourSemaine = this.futurTravail.nombreTrajets1JourSemaine;
      this.isNombreTrajets2JoursSemaine = this.futurTravail.nombreTrajets2JoursSemaine;
      this.isNombreTrajets3JoursSemaine = this.futurTravail.nombreTrajets3JoursSemaine;
      this.isNombreTrajets4JoursSemaine = this.futurTravail.nombreTrajets4JoursSemaine;
      this.isNombreTrajets5JoursSemaine = this.futurTravail.nombreTrajets5JoursSemaine;
      this.loadDataDistanceDomicileTravail();
    } else {
      this.futurTravail = new FuturTravail();
      this.futurTravail.nombreMoisContratCDD = null;
      this.futurTravail.salaire = new Salaire();
      this.futurTravail.salaire.montantMensuelBrut = null;
      this.futurTravail.salaire.montantMensuelNet = null;
      this.futurTravail.salaire.montantHoraireBrut = null;
      this.futurTravail.salaire.montantHoraireNet = null;
      this.futurTravail.hasOffreEmploiEnVue = null;
    }
  }

  private loadDataDistanceDomicileTravail() {
    this.isDistanceDomicileTravailEntre0Et9 = this.futurTravail.distanceDomicileTravailEntre0Et9;
    this.isDistanceDomicileTravailEntre10Et19 = this.futurTravail.distanceDomicileTravailEntre10Et19;
    this.isDistanceDomicileTravailEntre20Et30 = this.futurTravail.distanceDomicileTravailEntre20Et30;
    this.isDistanceDomicileTravailPlusDe30 = this.futurTravail.distanceDomicileTravailPlusDe30;

    if (this.isDistanceDomicileTravailEntre0Et9) this.futurTravail.distanceKmDomicileTravail = 5;
    else if (this.isDistanceDomicileTravailEntre10Et19) this.futurTravail.distanceKmDomicileTravail = 15;
    else if (this.isDistanceDomicileTravailEntre20Et30) this.futurTravail.distanceKmDomicileTravail = 25;
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
      if (!this.isModificationCriteres) this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.MA_SITUATION]);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  private isDonneesSaisiesValides(form: FormGroup): boolean {
    return form.valid
      && this.futurTravail.salaire.montantMensuelBrut > 0
      && this.futurTravail.salaire.montantMensuelNet > 0
      && !this.isNombreHeuresTravailleesSemaineInvalide()
      && !this.isTypeContratInvalide()
      && !this.isDureeHebdoInvalide()
      && !this.isSalaireSouhaiteInvalide()
      && !this.isDistanceDomicileTravailInvalide();
  }

  private isNombreHeuresTravailleesSemaineInvalide(): boolean {
    return this.futurTravail.nombreHeuresTravailleesSemaine && this.futurTravail.nombreHeuresTravailleesSemaine == 0 || this.futurTravail.nombreHeuresTravailleesSemaine > this.controleChampFormulaireService.MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX;
  }

  private isTypeContratInvalide(): boolean {
    return this.futurTravail.typeContrat == null || (this.isTypeContratCDI && this.isTypeContratCDD && this.isTypeContratInterim && this.isTypeContratIAE);
  }

  public isDureeHebdoInvalide(): boolean {
    return this.hasOffreEmploiNon && (
      (this.isDureeHebdoTempsPlein == null && this.isDureeHebdoMiTemps == null && this.isDureeHebdoAutre == null)
      || (
        (this.isDureeHebdoTempsPlein == this.isDureeHebdoMiTemps)
        && (this.isDureeHebdoTempsPlein == this.isDureeHebdoAutre)
        && (this.isDureeHebdoMiTemps == this.isDureeHebdoAutre)
      )
    );
  }

  public isSalaireSouhaiteInvalide(): boolean {
    return this.hasOffreEmploiNon && (
      (this.isSalaireSouhaiteSMIC == null && this.isSalaireSouhaiteAutre == null)
      || (this.isSalaireSouhaiteSMIC == this.isSalaireSouhaiteAutre)
      || (this.isSalaireSouhaiteAutre && this.futurTravail.salaire.montantMensuelNet == null)
    );
  }

  public isDistanceDomicileTravailInvalide(): boolean {
    return this.isDistanceDomicileTravailPlusDe30 && this.futurTravail.distanceKmDomicileTravail < 30;
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
      this.futurTravail.typeContrat = TypesContratTravailEnum.CDI;
    } else {
      this.futurTravail.hasOffreEmploiEnVue = null;
    }
  }

  public onClickCheckBoxIsTypeContratCDI() {
    if (this.isTypeContratCDI) {
      this.isTypeContratCDD = false;
      this.isTypeContratIAE = false;
      this.isTypeContratIAE = false;
      this.futurTravail.typeContrat = this.TypesContratTravailEnum.CDI;
      this.unsetNombreMoisContrat();
    } else {
      this.futurTravail.typeContrat = null;
    }
  }

  public onClickCheckBoxIsTypeContratCDD() {
    if (this.isTypeContratCDD) {
      this.isTypeContratCDI = false;
      this.isTypeContratIAE = false;
      this.isTypeContratIAE = false;
      this.futurTravail.typeContrat = this.TypesContratTravailEnum.CDD;
    } else {
      this.futurTravail.typeContrat = null;
      this.unsetNombreMoisContrat();
    }
  }

  public onClickCheckBoxIsTypeContratInterim() {
    if (this.isTypeContratInterim) {
      this.isTypeContratCDI = false;
      this.isTypeContratCDD = false;
      this.isTypeContratIAE = false;
      this.futurTravail.typeContrat = this.TypesContratTravailEnum.INTERIM;
    } else {
      this.futurTravail.typeContrat = null;
      this.unsetNombreMoisContrat();
    }
  }

  public onClickCheckBoxIsTypeContratIAE() {
    if (this.isTypeContratIAE) {
      this.isTypeContratCDI = false;
      this.isTypeContratCDD = false;
      this.isTypeContratInterim = false;
      this.futurTravail.typeContrat = this.TypesContratTravailEnum.IAE;
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

  public onClickCheckBoxNombresTrajets(nombreTrajetsSemaine: number) {
    switch (nombreTrajetsSemaine) {
      case 1:
        this.setNombreTrajets1JourSemaine();
        break;
      case 2:
        this.setNombreTrajets2JoursSemaine();
        break;
      case 3:
        this.setNombreTrajets3JoursSemaine();
        break;
      case 4:
        this.setNombreTrajets4JoursSemaine();
        break;
      case 5:
        this.setNombreTrajets5JoursSemaine();
        break;
    }

  }

  public setNombreTrajetsDomicileTravail(nombreTrajetsSemaine: number) {
    this.futurTravail.nombreTrajetsDomicileTravail = Math.floor(nombreTrajetsSemaine * 4.33);
  }

  public handleKeyUpOnButtonNombresTrajets(event: any, nombreTrajetsSemaine: number) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxNombresTrajets(nombreTrajetsSemaine);
    }
  }

  public onClickCheckBoxDistanceDomicileTravailEntre0Et9() {
    this.setDistanceDomicileTravailEntre0Et9();
  }

  public onClickCheckBoxDistanceDomicileTravailEntre10Et19() {
    this.setDistanceDomicileTravailEntre10Et19();
  }

  public onClickCheckBoxDistanceDomicileTravailEntre20Et30() {
    this.setDistanceDomicileTravailEntre20Et30();
  }

  public onClickCheckBoxDistanceDomicileTravailPlusDe30() {
    this.setDistanceDomicileTravailPlusDe30();
  }

  public handleKeyUpOnButtonDistanceDomicileTravailEntre0Et9(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxDistanceDomicileTravailEntre0Et9();
    }
  }

  public handleKeyUpOnButtonDistanceDomicileTravailEntre10Et19(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxDistanceDomicileTravailEntre10Et19();
    }
  }

  public handleKeyUpOnButtonDistanceDomicileTravailEntre20Et30(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxDistanceDomicileTravailEntre20Et30();
    }
  }

  public handleKeyUpOnButtonDistanceDomicileTravailPlusDe30(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxDistanceDomicileTravailPlusDe30();
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

  public handleKeyUpOnButtonIsTypeContratInterim(event: any) {
    if (event.keyCode === 13) {
      this.isTypeContratInterim = !this.isTypeContratInterim;
      this.onClickCheckBoxIsTypeContratInterim();
    }
  }

  public handleKeyUpOnButtonIsTypeContratIAE(event: any) {
    if (event.keyCode === 13) {
      this.isTypeContratIAE = !this.isTypeContratIAE;
      this.onClickCheckBoxIsTypeContratIAE();
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

  public calculSalaireFromMensuelNet() {
    if (this.futurTravail.salaire.montantMensuelNet >= 57) {
      this.futurTravail.salaire.montantMensuelBrut = this.salaireService.getBrutFromNet(this.futurTravail.salaire.montantMensuelNet, this.futurTravail.typeContrat);
      this.futurTravail.salaire.montantHoraireNet = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelNet);
      this.futurTravail.salaire.montantHoraireBrut = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelBrut);
    }
  }

  public calculSalaireFromMensuelBrut() {
    if (this.futurTravail.salaire.montantMensuelBrut >= 100) {
      this.futurTravail.salaire.montantMensuelNet = this.salaireService.getNetFromBrut(this.futurTravail.salaire.montantMensuelBrut, this.futurTravail.typeContrat);
      this.futurTravail.salaire.montantHoraireBrut = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelBrut);
      this.futurTravail.salaire.montantHoraireNet = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelNet);
    }
  }

  public calculSalaireFromHoraireNet() {
    this.futurTravail.salaire.montantMensuelNet = this.salaireService.getMontantMensuelFromMontantHoraire(this.futurTravail.salaire.montantHoraireNet);
    this.futurTravail.salaire.montantMensuelBrut = this.salaireService.getBrutFromNet(this.futurTravail.salaire.montantMensuelNet, this.futurTravail.typeContrat);
    this.futurTravail.salaire.montantHoraireBrut = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelBrut);

  }

  public calculSalaireFromHoraireBrut() {
    this.futurTravail.salaire.montantMensuelBrut = this.salaireService.getMontantMensuelFromMontantHoraire(this.futurTravail.salaire.montantHoraireBrut);
    this.futurTravail.salaire.montantMensuelNet = this.salaireService.getNetFromBrut(this.futurTravail.salaire.montantMensuelBrut, this.futurTravail.typeContrat);
    this.futurTravail.salaire.montantHoraireNet = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelNet);

  }

  public propagateSalaireHoraireMensuel() {
    this.isFuturTravailSalaireFormSubmitted = false;
    if (this.futurTravail.salaire.montantHoraireNet != null || this.futurTravail.salaire.montantHoraireBrut != null || this.futurTravail.salaire.montantMensuelNet != null || this.futurTravail.salaire.montantMensuelBrut != null) {
      switch (this.typeSalaireDisplay) {
        case "mensuel_net":
          this.calculSalaireFromMensuelNet();
          break;
        case "mensuel_brut":
          this.calculSalaireFromMensuelBrut();
          break;
        case "horaire_net":
          this.calculSalaireFromHoraireNet();
          break;
        case "horaire_brut":
          this.calculSalaireFromHoraireBrut();
          break;
      }
    } else {
      this.futurTravail.salaire.montantHoraireBrut = undefined;
      this.futurTravail.salaire.montantHoraireNet = undefined;
      this.futurTravail.salaire.montantMensuelBrut = undefined;
      this.futurTravail.salaire.montantMensuelNet = undefined;
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
    return this.salaireService.getSmicMensuelNetFromNombreHeure(this.futurTravail.nombreHeuresTravailleesSemaine)
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
    this.futurTravail.salaire.montantMensuelNet = this.getMontantSmicMensuelNet();
    this.futurTravail.salaire.montantMensuelBrut = this.salaireService.getBrutFromNet(this.futurTravail.salaire.montantMensuelNet, this.futurTravail.typeContrat, this.futurTravail.nombreHeuresTravailleesSemaine);
    this.futurTravail.salaire.montantHoraireNet = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelNet, this.futurTravail.nombreHeuresTravailleesSemaine);
    this.futurTravail.salaire.montantHoraireBrut = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelBrut, this.futurTravail.nombreHeuresTravailleesSemaine);
  }

  public unsetSalaireSouhaiteSMIC() {
    this.futurTravail.salaireSouhaiteSMIC = false;
    this.futurTravail.salaire.montantMensuelNet = null;
    this.futurTravail.salaire.montantMensuelBrut = null;
    this.futurTravail.salaire.montantHoraireNet = null;
    this.futurTravail.salaire.montantHoraireBrut = null;
  }

  public setSalaireSouhaiteAutre() {
    this.isSalaireSouhaiteSMIC = false;
    this.futurTravail.salaireSouhaiteAutre = true;
    this.futurTravail.salaireSouhaiteSMIC = false;
  }

  public unsetSalaireSouhaiteAutre() {
    this.futurTravail.dureeHebdoTempsPlein = false;
    this.futurTravail.salaire.montantMensuelNet = null;
    this.futurTravail.salaire.montantMensuelBrut = null;
    this.futurTravail.salaire.montantHoraireNet = null;
    this.futurTravail.salaire.montantHoraireBrut = null;
  }

  public setNombreTrajets1JourSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.isNombreTrajets1JourSemaine = true;
    this.futurTravail.nombreTrajets1JourSemaine = true;
    this.setNombreTrajetsDomicileTravail(1);
  }

  public setNombreTrajets2JoursSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.isNombreTrajets2JoursSemaine = true;
    this.futurTravail.nombreTrajets2JoursSemaine = true;
    this.setNombreTrajetsDomicileTravail(2);
  }

  public setNombreTrajets3JoursSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.isNombreTrajets3JoursSemaine = true;
    this.futurTravail.nombreTrajets3JoursSemaine = true;
    this.setNombreTrajetsDomicileTravail(3);
  }

  public setNombreTrajets4JoursSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.isNombreTrajets4JoursSemaine = true;
    this.futurTravail.nombreTrajets4JoursSemaine = true;
    this.setNombreTrajetsDomicileTravail(4);
  }

  public setNombreTrajets5JoursSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.isNombreTrajets5JoursSemaine = true;
    this.futurTravail.nombreTrajets5JoursSemaine = true;
    this.setNombreTrajetsDomicileTravail(5);
  }

  public unsetNombreTrajetsDomicileTravail() {
    this.isNombreTrajets1JourSemaine = false;
    this.isNombreTrajets2JoursSemaine = false;
    this.isNombreTrajets3JoursSemaine = false;
    this.isNombreTrajets4JoursSemaine = false;
    this.isNombreTrajets5JoursSemaine = false;
    this.futurTravail.nombreTrajets1JourSemaine = false;
    this.futurTravail.nombreTrajets2JoursSemaine = false;
    this.futurTravail.nombreTrajets3JoursSemaine = false;
    this.futurTravail.nombreTrajets4JoursSemaine = false;
    this.futurTravail.nombreTrajets5JoursSemaine = false;
  }

  public setDistanceDomicileTravailEntre0Et9() {
    this.unsetDistanceDomicileTravail();
    this.isDistanceDomicileTravailEntre0Et9 = true;
    this.futurTravail.distanceDomicileTravailEntre0Et9 = true;
    this.futurTravail.distanceKmDomicileTravail = 5;
  }

  public setDistanceDomicileTravailEntre10Et19() {
    this.unsetDistanceDomicileTravail();
    this.isDistanceDomicileTravailEntre10Et19 = true;
    this.futurTravail.distanceDomicileTravailEntre10Et19 = true;
    this.futurTravail.distanceKmDomicileTravail = 15;
  }

  public setDistanceDomicileTravailEntre20Et30() {
    this.unsetDistanceDomicileTravail();
    this.isDistanceDomicileTravailEntre20Et30 = true;
    this.futurTravail.distanceDomicileTravailEntre20Et30 = true;
    this.futurTravail.distanceKmDomicileTravail = 25;
  }

  public setDistanceDomicileTravailPlusDe30() {
    this.unsetDistanceDomicileTravail();
    this.isDistanceDomicileTravailPlusDe30 = true;
    this.futurTravail.distanceDomicileTravailPlusDe30 = true;
  }

  public unsetDistanceDomicileTravail() {
    this.isDistanceDomicileTravailEntre0Et9 = false;
    this.isDistanceDomicileTravailEntre10Et19 = false;
    this.isDistanceDomicileTravailEntre20Et30 = false;
    this.isDistanceDomicileTravailPlusDe30 = false;
    this.futurTravail.distanceKmDomicileTravail = null;
    this.futurTravail.distanceDomicileTravailEntre0Et9 = false;
    this.futurTravail.distanceDomicileTravailEntre10Et19 = false;
    this.futurTravail.distanceDomicileTravailEntre20Et30 = false;
    this.futurTravail.distanceDomicileTravailPlusDe30 = false;
  }
}
