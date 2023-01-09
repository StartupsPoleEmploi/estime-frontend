import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeadlineEnum } from '@app/commun/enumerations/page-headline.enum';
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

  @ViewChild('futurTravailForm', { read: NgForm }) futurTravailForm: UntypedFormGroup;
  @Input() isModificationCriteres: boolean;

  futurTravail: FuturTravail;
  isFuturTravailFormSubmitted: boolean;
  isNombreTrajetsDomicileTravailDisplay = false;
  PageHeadlineEnum: typeof PageHeadlineEnum = PageHeadlineEnum;
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
    this.isFuturTravailFormSubmitted = false;
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
    this.loadDataNombreAllersRetours();
  }

  private loadDataDistanceDomicileTravail() {
    this.isDistanceDomicileTravailEntre0Et9 = (this.futurTravail.distanceKmDomicileTravail > 0 && this.futurTravail.distanceKmDomicileTravail <= 9);
    this.isDistanceDomicileTravailEntre10Et19 = (this.futurTravail.distanceKmDomicileTravail > 9 && this.futurTravail.distanceKmDomicileTravail <= 19);
    this.isDistanceDomicileTravailEntre20Et30 = (this.futurTravail.distanceKmDomicileTravail > 19 && this.futurTravail.distanceKmDomicileTravail < 30);
    this.isDistanceDomicileTravailPlusDe30 = (this.futurTravail.distanceKmDomicileTravail >= 30);

    if (this.isDistanceDomicileTravailEntre0Et9) this.futurTravail.distanceKmDomicileTravail = 5;
    else if (this.isDistanceDomicileTravailEntre10Et19) this.futurTravail.distanceKmDomicileTravail = 15;
    else if (this.isDistanceDomicileTravailEntre20Et30) this.futurTravail.distanceKmDomicileTravail = 25;
  }

  private loadDataNombreAllersRetours() {
    this.isNombreTrajets1JourSemaine = this.futurTravail.nombreTrajets1JourSemaine;
    this.isNombreTrajets2JoursSemaine = this.futurTravail.nombreTrajets2JoursSemaine;
    this.isNombreTrajets3JoursSemaine = this.futurTravail.nombreTrajets3JoursSemaine;
    this.isNombreTrajets4JoursSemaine = this.futurTravail.nombreTrajets4JoursSemaine;
    this.isNombreTrajets5JoursSemaine = this.futurTravail.nombreTrajets5JoursSemaine;
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }

  public onSubmitFuturTravailForm(): void {
    this.isFuturTravailFormSubmitted = true;
    this.propagateSalaire();
    if (this.isDonneesSaisiesValides(this.futurTravailForm)) {
      if (!this.afficherNombreTrajetsDomicileTravail()) this.futurTravail.nombreTrajetsDomicileTravail = 0;
      this.deConnecteService.setFuturTravail(this.futurTravail);
      if (!this.isModificationCriteres) this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.SITUATION]);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  private isDonneesSaisiesValides(form: UntypedFormGroup): boolean {
    return form?.valid
      && this.futurTravail.salaire.montantMensuelBrut > 0
      && this.futurTravail.salaire.montantMensuelNet > 0
      && !this.isNombreHeuresTravailleesSemaineInvalide()
      && !this.isTypeContratInvalide()
      && !this.isDureeHebdoInvalide()
      && !this.isSalaireSouhaiteInvalide()
      && !this.isDistanceDomicileTravailInvalide()
      && !this.isChampsNombreTrajetsSemaineInvalides();
  }

  public isNombreHeuresTravailleesSemaineInvalide(): boolean {
    return this.futurTravail.nombreHeuresTravailleesSemaine && this.futurTravail.nombreHeuresTravailleesSemaine == 0 || this.futurTravail.nombreHeuresTravailleesSemaine > this.controleChampFormulaireService.MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX;
  }

  public isTypeContratInvalide(): boolean {
    return this.hasOffreEmploiOui
      && (
        this.futurTravail.typeContrat == null
        || (
          !this.isTypeContratCDI
          && !this.isTypeContratCDD
          && !this.isTypeContratInterim
          && !this.isTypeContratIAE
        )
      );
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
    return !this.futurTravail.hasOffreEmploiEnVue && (this.isDistanceDomicileTravailPlusDe30 && this.futurTravail.distanceKmDomicileTravail < 30);
  }

  public onClickCheckBoxHasOffreEmploiOui() {
    if (this.hasOffreEmploiOui) {
      this.hasOffreEmploiNon = false;
      this.futurTravail.hasOffreEmploiEnVue = true;
    } else {
      this.futurTravail.hasOffreEmploiEnVue = null;
    }
    this.loadDataDistanceDomicileTravail();
  }

  public onClickCheckBoxHasOffreEmploiNon() {
    if (this.hasOffreEmploiNon) {
      this.hasOffreEmploiOui = false;
      this.futurTravail.hasOffreEmploiEnVue = false;
      this.futurTravail.typeContrat = TypesContratTravailEnum.CDI;
    } else {
      this.futurTravail.hasOffreEmploiEnVue = null;
    }
    this.loadDataDistanceDomicileTravail();
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsTypeContratCDI() {
    if (this.isTypeContratCDI) {
      this.isTypeContratCDD = false;
      this.isTypeContratIAE = false;
      this.isTypeContratInterim = false;
      this.futurTravail.typeContrat = this.TypesContratTravailEnum.CDI;
      this.unsetNombreMoisContrat();
    } else {
      this.futurTravail.typeContrat = null;
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsTypeContratCDD() {
    if (this.isTypeContratCDD) {
      this.isTypeContratCDI = false;
      this.isTypeContratIAE = false;
      this.isTypeContratInterim = false;
      this.futurTravail.typeContrat = this.TypesContratTravailEnum.CDD;
    } else {
      this.futurTravail.typeContrat = null;
      this.unsetNombreMoisContrat();
    }
    this.isFuturTravailFormSubmitted = false;
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
    this.isFuturTravailFormSubmitted = false;
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
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsDureeHebdoTempsPlein() {
    if (this.isDureeHebdoTempsPlein) {
      this.setDureeHebdoTempsPlein();
    } else {
      this.unsetDureeHebdoTempsPlein();
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsDureeHebdoMiTemps() {
    if (this.isDureeHebdoMiTemps) {
      this.setDureeHebdoMiTemps();
    } else {
      this.unsetDureeHebdoMiTemps();
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsDureeHebdoAutre() {
    if (this.isDureeHebdoAutre) {
      this.setDureeHebdoAutre();
    } else {
      this.unsetDureeHebdoAutre();
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsSalaireSouhaiteSMIC() {
    if (this.isSalaireSouhaiteSMIC) {
      this.setSalaireSouhaiteSMIC();
    } else {
      this.unsetSalaireSouhaiteSMIC();
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsSalaireSouhaiteAutre() {
    if (this.isSalaireSouhaiteAutre) {
      this.setSalaireSouhaiteAutre();
    } else {
      this.unsetSalaireSouhaiteAutre();
    }
    this.isFuturTravailFormSubmitted = false;
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
    this.isFuturTravailFormSubmitted = false;
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
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxDistanceDomicileTravailEntre10Et19() {
    this.setDistanceDomicileTravailEntre10Et19();
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxDistanceDomicileTravailEntre20Et30() {
    this.setDistanceDomicileTravailEntre20Et30();
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxDistanceDomicileTravailPlusDe30() {
    this.setDistanceDomicileTravailPlusDe30();
    this.isFuturTravailFormSubmitted = false;
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
      this.onClickCheckBoxHasOffreEmploiOui();
    }
  }

  public handleKeyUpOnButtonOffreEmploiNon(event: any) {
    if (event.keyCode === 13) {
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
      this.onClickCheckBoxIsTypeContratInterim();
    }
  }

  public handleKeyUpOnButtonIsTypeContratIAE(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsTypeContratIAE();
    }
  }

  public handleKeyUpOnButtonIsDureeHebdoTempsPlein(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsDureeHebdoTempsPlein();
    }
  }

  public handleKeyUpOnButtonIsDureeHebdoMiTemps(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsDureeHebdoMiTemps();
    }
  }

  public handleKeyUpOnButtonIsDureeHebdoAutre(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsDureeHebdoAutre();
    }
  }

  public handleKeyUpOnButtonIsSalaireSouhaiteSMIC(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsSalaireSouhaiteSMIC();
    }
  }

  public handleKeyUpOnButtonIsSalaireSouhaiteAutre(event: any) {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsSalaireSouhaiteAutre();
    }
  }

  public handleAffichageNombreTrajetsDomicileTravail() {
    this.isNombreTrajetsDomicileTravailDisplay = this.aidesService.isEligibleAideMobilite(this.deConnecteService.getDemandeurEmploiConnecte(), this.futurTravail.distanceKmDomicileTravail);
    if (!this.isNombreTrajetsDomicileTravailDisplay) {
      this.futurTravail.nombreTrajetsDomicileTravail = null;
    }
  }

  public propagateSalaireHoraireMensuel() {
    if (this.futurTravail.salaire.montantHoraireNet != null || this.futurTravail.salaire.montantHoraireBrut != null || this.futurTravail.salaire.montantMensuelNet != null || this.futurTravail.salaire.montantMensuelBrut != null) {
      switch (this.typeSalaireDisplay) {
        case "mensuel_net":
          this.salaireService.calculSalaireFromMensuelNet(this.futurTravail);
          break;
        case "mensuel_brut":
          this.salaireService.calculSalaireFromMensuelBrut(this.futurTravail);
          break;
        case "horaire_net":
          this.salaireService.calculSalaireFromHoraireNet(this.futurTravail);
          break;
        case "horaire_brut":
          this.salaireService.calculSalaireFromHoraireBrut(this.futurTravail);
          break;
      }
    } else {
      this.futurTravail.salaire.montantHoraireBrut = undefined;
      this.futurTravail.salaire.montantHoraireNet = undefined;
      this.futurTravail.salaire.montantMensuelBrut = undefined;
      this.futurTravail.salaire.montantMensuelNet = undefined;
    }
    this.isFuturTravailFormSubmitted = false;
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
    return (this.hasOffreEmploiOui || this.hasOffreEmploiNon) &&
      this.futurTravail.distanceKmDomicileTravail >= ContratTravailComponent.DISTANCE_MINI_AIDE_MOB;
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

  // GESTION DES ERREURS DE FORMULAIRE

  public isChampFuturContratInvalide(): boolean {
    return (this.isFuturTravailFormSubmitted && this.isTypeContratInvalide());
  }


  public isChampDureeHebdomadaireInvalide(dureeHebdomadaire): boolean {
    return this.isChampDureeHebdomadaireEgalAZero(dureeHebdomadaire)
      || this.isChampDureeHebdomadaireNonPresent(dureeHebdomadaire)
      || this.isChampDistanceDomicileTravailInvalide(dureeHebdomadaire);
  }

  public isChampDureeHebdomadaireEgalAZero(dureeHebdomadaire): boolean {
    return ((this.isFuturTravailFormSubmitted || dureeHebdomadaire?.touched)
      && (
        this.futurTravail.nombreHeuresTravailleesSemaine
        && this.futurTravail.nombreHeuresTravailleesSemaine <= 0
      )
    );
  }

  public isChampDureeHebdomadaireNonPresent(dureeHebdomadaire): boolean {
    return ((this.isFuturTravailFormSubmitted || dureeHebdomadaire?.touched)
      && (
        !this.futurTravail.nombreHeuresTravailleesSemaine
        || dureeHebdomadaire?.errors?.required
      )
    );
  }

  public isChampDureeHebdomadaireErreurMontantMaxDepasse(dureeHebdomadaire): boolean {
    return ((this.isFuturTravailFormSubmitted || dureeHebdomadaire?.touched) && this.futurTravail.nombreHeuresTravailleesSemaine > this.controleChampFormulaireService.MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX);
  }

  public isChampDistanceDomicileTravailInvalide(distanceDomicileLieuTravail): boolean {
    return ((this.isFuturTravailFormSubmitted || distanceDomicileLieuTravail?.touched)
      && this.futurTravail.distanceKmDomicileTravail == null);
  }

  public isChampsNombreTrajetsSemaineInvalides(): boolean {
    return (this.isFuturTravailFormSubmitted
      && this.afficherNombreTrajetsDomicileTravail()
      && (
        !this.isNombreTrajets1JourSemaine
        && !this.isNombreTrajets2JoursSemaine
        && !this.isNombreTrajets3JoursSemaine
        && !this.isNombreTrajets4JoursSemaine
        && !this.isNombreTrajets5JoursSemaine
      )
    )
  }

  public isChampFuturSalaireInvalide(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet) {
    return this.isChampFuturSalaireNonPresent(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet)
      || this.isChampFuturSalaireEgalAZero(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet)
      || this.isChampFuturSalaireErreurMontant(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet);
  }

  public isChampFuturSalaireNonPresent(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet): boolean {
    return (this.isFuturTravailFormSubmitted ||
      (
        salaireMensuelBrut?.touched
        || salaireHoraireBrut?.touched
        || salaireMensuelNet?.touched
        || salaireHoraireNet?.touched
      ) && (
        this.futurTravail.salaire.montantMensuelBrut == null
        || this.futurTravail.salaire.montantHoraireBrut == null
        || this.futurTravail.salaire.montantMensuelNet == null
        || this.futurTravail.salaire.montantHoraireNet == null
      )
    );
  }

  public isChampFuturSalaireEgalAZero(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet): boolean {
    return ((this.isFuturTravailFormSubmitted || salaireMensuelBrut?.touched) && this.futurTravail.salaire.montantMensuelBrut != null && this.futurTravail.salaire.montantMensuelBrut <= 0)
      || ((this.isFuturTravailFormSubmitted || salaireMensuelNet?.touched) && this.futurTravail.salaire.montantMensuelNet != null && this.futurTravail.salaire.montantMensuelNet <= 0)
      || ((this.isFuturTravailFormSubmitted || salaireHoraireBrut?.touched) && this.futurTravail.salaire.montantHoraireBrut != null && this.futurTravail.salaire.montantHoraireBrut <= 0)
      || ((this.isFuturTravailFormSubmitted || salaireHoraireNet?.touched) && this.futurTravail.salaire.montantHoraireNet != null && this.futurTravail.salaire.montantHoraireNet <= 0)
  }

  public isChampFuturSalaireErreurMontant(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet): boolean {
    return ((this.isFuturTravailFormSubmitted || salaireMensuelBrut?.touched) && salaireMensuelBrut?.errors?.pattern)
      || ((this.isFuturTravailFormSubmitted || salaireMensuelNet?.touched) && salaireMensuelNet?.errors?.pattern)
      || ((this.isFuturTravailFormSubmitted || salaireHoraireBrut?.touched) && salaireHoraireBrut?.errors?.pattern)
      || ((this.isFuturTravailFormSubmitted || salaireHoraireNet?.touched) && salaireHoraireNet?.errors?.pattern);
  }

  public isChampSalaireSouhaiteInvalide(salaireMensuelNet): boolean {
    return this.isChampSalaireSouhaiteEgalAZero(salaireMensuelNet)
      || this.isChampSalaireSouhaiteNonPresent(salaireMensuelNet)
      || this.isChampSalaireSouhaiteErreurMontant(salaireMensuelNet);
  }

  public isChampSalaireSouhaiteEgalAZero(salaireMensuelNet): boolean {
    return ((this.isFuturTravailFormSubmitted || salaireMensuelNet?.touched) && (this.futurTravail.salaire.montantMensuelNet && this.futurTravail.salaire.montantMensuelNet <= 0));
  }

  public isChampSalaireSouhaiteNonPresent(salaireMensuelNet): boolean {
    return ((this.isFuturTravailFormSubmitted || salaireMensuelNet?.touched) && (this.isSalaireSouhaiteAutre && !this.futurTravail.salaire.montantMensuelNet));
  }

  public isChampSalaireSouhaiteErreurMontant(salaireMensuelNet): boolean {
    return ((this.isFuturTravailFormSubmitted || salaireMensuelNet?.touched) && salaireMensuelNet?.errors?.pattern);
  }

  public isSalaireSouhaiteNonSelectionne(): boolean {
    return (this.isFuturTravailFormSubmitted
      && (
        this.hasOffreEmploiNon && (
          !this.isSalaireSouhaiteSMIC
          && !this.isSalaireSouhaiteAutre
        )
      )
    );
  }

  public isChampDureeHebdomadaireEnvisageeInvalide(dureeHebdomadaire): boolean {
    return this.isChampDureeHebdomadaireEnvisageeEgalAZero(dureeHebdomadaire)
      || this.isChampDureeHebdomadaireEnvisageeNonPresent(dureeHebdomadaire)
      || this.isChampDureeHebdomadaireEnvisageeErreurMontantMaxDepasse(dureeHebdomadaire)
      || this.isChampDureeHebdomadaireEnvisageeErreurMontant(dureeHebdomadaire)
      || this.isChampDureeHebdomadaireEnvisageeNonSelectionne();
  }

  public isChampDureeHebdomadaireEnvisageeNonSelectionne(): boolean {
    return (this.isFuturTravailFormSubmitted
      && (
        this.hasOffreEmploiNon && (
          !this.isDureeHebdoTempsPlein
          && !this.isDureeHebdoMiTemps
          && !this.isDureeHebdoAutre
        )
      )
    );
  }

  public isChampDureeHebdomadaireEnvisageeEgalAZero(dureeHebdomadaire): boolean {
    return ((this.isFuturTravailFormSubmitted || dureeHebdomadaire?.touched) && (this.futurTravail.nombreHeuresTravailleesSemaine && this.futurTravail.nombreHeuresTravailleesSemaine <= 0));
  }

  public isChampDureeHebdomadaireEnvisageeNonPresent(dureeHebdomadaire): boolean {
    return ((this.isFuturTravailFormSubmitted || dureeHebdomadaire?.touched)
      && (
        this.isDureeHebdoAutre
        && (
          !this.futurTravail.nombreHeuresTravailleesSemaine
          || dureeHebdomadaire?.errors?.required
        )
      )
    );
  }

  public isChampDureeHebdomadaireEnvisageeErreurMontantMaxDepasse(dureeHebdomadaire): boolean {
    return ((this.isFuturTravailFormSubmitted || dureeHebdomadaire?.touched) && this.futurTravail.nombreHeuresTravailleesSemaine > this.controleChampFormulaireService.MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX);
  }

  public isChampDureeHebdomadaireEnvisageeErreurMontant(dureeHebdomadaire): boolean {
    return ((this.isFuturTravailFormSubmitted || dureeHebdomadaire?.touched) && dureeHebdomadaire?.errors?.pattern);
  }

  public isChampDistanceDomicileTravailEnvisageeInvalide(distanceDomicileLieuTravail, distanceDomicileTravailEntre0Et9, distanceDomicileTravailEntre10Et19, distanceDomicileTravailEntre20Et30, distanceDomicileTravailPlusDe30): boolean {
    return this.isChampDistanceDomicileTravailEnvisageeErreurMontant(distanceDomicileLieuTravail)
      || this.isChampDistanceDomicileTravailEnvisageeNonPresent(distanceDomicileLieuTravail, distanceDomicileTravailEntre0Et9, distanceDomicileTravailEntre10Et19, distanceDomicileTravailEntre20Et30, distanceDomicileTravailPlusDe30)
      || this.isChampDistanceDomicileTravailEnvisageeNonSelectionne();
  }

  public isChampDistanceDomicileTravailEnvisageeErreurMontant(distanceDomicileLieuTravail): boolean {
    return (this.isFuturTravailFormSubmitted || distanceDomicileLieuTravail?.touched)
      && !this.futurTravail.hasOffreEmploiEnVue
      && (this.isDistanceDomicileTravailPlusDe30 && this.futurTravail.distanceKmDomicileTravail < 30);
  }

  public isChampDistanceDomicileTravailEnvisageeNonPresent(distanceDomicileLieuTravail, distanceDomicileTravailEntre0Et9, distanceDomicileTravailEntre10Et19, distanceDomicileTravailEntre20Et30, distanceDomicileTravailPlusDe30): boolean {
    return (this.isFuturTravailFormSubmitted || (distanceDomicileLieuTravail && distanceDomicileLieuTravail.touched))
      && (
        distanceDomicileTravailEntre0Et9.errors?.required
        || distanceDomicileTravailEntre10Et19.errors?.required
        || distanceDomicileTravailEntre20Et30.errors?.required
        || distanceDomicileTravailPlusDe30.errors?.required
      );
  }

  public isChampDistanceDomicileTravailEnvisageeNonSelectionne(): boolean {
    return (this.isFuturTravailFormSubmitted
      && (
        this.hasOffreEmploiNon && (
          !this.isDistanceDomicileTravailEntre0Et9
          && !this.isDistanceDomicileTravailEntre10Et19
          && !this.isDistanceDomicileTravailEntre20Et30
          && !this.isDistanceDomicileTravailPlusDe30
        )
      )
    );
  }
}
