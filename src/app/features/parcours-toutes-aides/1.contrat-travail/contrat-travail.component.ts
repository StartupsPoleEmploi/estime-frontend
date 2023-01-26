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
import { TypeContratTravailEnum } from '@app/commun/enumerations/enumerations-formulaire/type-contrat-travail.enum';
import { FuturTravail } from '@models/futur-travail';
import { LibellesCourtsTypesContratTravailEnum } from '@app/commun/enumerations/libelles-courts-types-contrat-travail.enum';
import { TypeDureeHebdoEnum } from '@app/commun/enumerations/enumerations-formulaire/type-duree-hebdo.enum';
import { TypeDistanceDomicileTravailEnum } from '@app/commun/enumerations/enumerations-formulaire/type-distance-domicile-travail.enum';
import { TypeNombreTrajetsSemaineEnum } from '@app/commun/enumerations/enumerations-formulaire/type-nombre-trajets-semaine.enum';
import { TypeSalaireDisplayEnum } from '@app/commun/enumerations/enumerations-formulaire/type-salaire-display.enum';
import { TypeSalaireSouhaiteEnum } from '@app/commun/enumerations/enumerations-formulaire/type-salaire-souhaite.enum';

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

  TypeContratTravailEnum: typeof TypeContratTravailEnum = TypeContratTravailEnum;
  TypeDureeHebdoEnum: typeof TypeDureeHebdoEnum = TypeDureeHebdoEnum;
  TypeDistanceDomicileTravailEnum: typeof TypeDistanceDomicileTravailEnum = TypeDistanceDomicileTravailEnum;
  TypeNombreTrajetsSemaineEnum: typeof TypeNombreTrajetsSemaineEnum = TypeNombreTrajetsSemaineEnum;
  TypeSalaireDisplayEnum: typeof TypeSalaireDisplayEnum = TypeSalaireDisplayEnum;
  TypeSalaireSouhaiteEnum: typeof TypeSalaireSouhaiteEnum = TypeSalaireSouhaiteEnum;

  LibellesTypesContratTravailEnum: typeof LibellesTypesContratTravailEnum = LibellesTypesContratTravailEnum;
  LibellesCourtsTypesContratTravailEnum: typeof LibellesCourtsTypesContratTravailEnum = LibellesCourtsTypesContratTravailEnum;
  messageErreurSalaire: string;
  hasOffreEmploi: boolean;

  typeContrat: string
  typeSalaireDisplay: string;
  typeDureeHebdo: string;
  typeNombreTrajetsSemaine: string;
  typeSalaireSouhaite: string;
  typeDistanceDomicileTravail: string;

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
      this.hasOffreEmploi = this.futurTravail.hasOffreEmploiEnVue;
      this.typeContrat = this.futurTravail.typeContrat;
      this.typeDureeHebdo = this.futurTravail.typeDureeHebdo;
      this.typeSalaireSouhaite = this.futurTravail.typeSalaireSouhaite;
      this.typeDistanceDomicileTravail = this.futurTravail.typeDistanceDomicileTravail;
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
    if (this.futurTravail.distanceKmDomicileTravail > 0 && this.futurTravail.distanceKmDomicileTravail <= 9) {
      this.typeDistanceDomicileTravail = TypeDistanceDomicileTravailEnum.ENTRE_0_ET_9;
    } else if (this.futurTravail.distanceKmDomicileTravail > 9 && this.futurTravail.distanceKmDomicileTravail <= 19) {
      this.typeDistanceDomicileTravail = TypeDistanceDomicileTravailEnum.ENTRE_10_ET_19;
    } else if (this.futurTravail.distanceKmDomicileTravail > 19 && this.futurTravail.distanceKmDomicileTravail < 30) {
      this.typeDistanceDomicileTravail = TypeDistanceDomicileTravailEnum.ENTRE_20_ET_30;
    } else if (this.futurTravail.distanceKmDomicileTravail >= 30) {
      this.typeDistanceDomicileTravail = TypeDistanceDomicileTravailEnum.PLUS_DE_30;
    }

    if (this.typeDistanceDomicileTravail == TypeDistanceDomicileTravailEnum.ENTRE_0_ET_9) this.futurTravail.distanceKmDomicileTravail = 5;
    else if (this.typeDistanceDomicileTravail == TypeDistanceDomicileTravailEnum.ENTRE_10_ET_19) this.futurTravail.distanceKmDomicileTravail = 15;
    else if (this.typeDistanceDomicileTravail == TypeDistanceDomicileTravailEnum.ENTRE_20_ET_30) this.futurTravail.distanceKmDomicileTravail = 25;
  }

  private loadDataNombreAllersRetours() {
    this.typeNombreTrajetsSemaine = this.futurTravail.typeNombreTrajetsSemaine;
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
      && !this.isNombreMoisContratCDDInvalide()
      && !this.isDureeHebdoInvalide()
      && !this.isSalaireSouhaiteInvalide()
      && !this.isDistanceDomicileTravailInvalide()
      && !this.isChampsNombreTrajetsSemaineInvalides();
  }

  public isNombreHeuresTravailleesSemaineInvalide(): boolean {
    return this.futurTravail.nombreHeuresTravailleesSemaine && this.futurTravail.nombreHeuresTravailleesSemaine == 0 || this.futurTravail.nombreHeuresTravailleesSemaine > this.controleChampFormulaireService.MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX;
  }

  public isTypeContratInvalide(): boolean {
    return this.hasOffreEmploi
      && (
        this.futurTravail.typeContrat == null
        || (
          this.typeContrat != TypeContratTravailEnum.CDD
          && this.typeContrat != TypeContratTravailEnum.CDI
          && this.typeContrat != TypeContratTravailEnum.IAE
          && this.typeContrat != TypeContratTravailEnum.INTERIM
        )
      );
  }

  public isNombreMoisContratCDDAAfficher() {
    return (this.typeContrat == TypeContratTravailEnum.CDD || this.typeContrat == TypeContratTravailEnum.INTERIM || this.typeContrat == TypeContratTravailEnum.IAE);
  }

  public isNombreMoisContratCDDInvalide(): boolean {
    return this.hasOffreEmploi
      && (
        this.futurTravail.typeContrat != null
        && (
          this.typeContrat == TypeContratTravailEnum.CDD
          || this.typeContrat == TypeContratTravailEnum.IAE
          || this.typeContrat == TypeContratTravailEnum.INTERIM
        )
        && this.futurTravail.nombreMoisContratCDD == null
      );
  }

  public isDureeHebdoInvalide(): boolean {
    return !this.hasOffreEmploi && (
      (this.typeDureeHebdo == null)
      || (
        (this.typeDureeHebdo != this.TypeDureeHebdoEnum.TEMPS_PLEIN)
        && (this.typeDureeHebdo != this.TypeDureeHebdoEnum.MI_TEMPS)
        && (this.typeDureeHebdo != this.TypeDureeHebdoEnum.AUTRE)
      )
    );
  }

  public isSalaireSouhaiteInvalide(): boolean {
    return !this.hasOffreEmploi && (
      (this.typeSalaireSouhaite == null)
      || (this.typeSalaireSouhaite != TypeSalaireSouhaiteEnum.SMIC
        && this.typeSalaireSouhaite != TypeSalaireSouhaiteEnum.AUTRE)
      || (this.typeSalaireSouhaite == TypeSalaireSouhaiteEnum.AUTRE && this.futurTravail.salaire.montantMensuelNet == null)
    );
  }

  public isDistanceDomicileTravailInvalide(): boolean {
    return !this.futurTravail.hasOffreEmploiEnVue && (this.typeDistanceDomicileTravail == TypeDistanceDomicileTravailEnum.PLUS_DE_30 && this.futurTravail.distanceKmDomicileTravail < 30);
  }

  public onClickCheckBoxHasOffreEmploiOui() {
    if (this.hasOffreEmploi !== true) {
      this.hasOffreEmploi = true;
      this.futurTravail.hasOffreEmploiEnVue = true;
    }
    this.loadDataDistanceDomicileTravail();
  }

  public onClickCheckBoxHasOffreEmploiNon() {
    if (this.hasOffreEmploi !== false) {
      this.hasOffreEmploi = false;
      this.futurTravail.hasOffreEmploiEnVue = false;
      this.futurTravail.typeContrat = TypeContratTravailEnum.CDI;
    }
    this.loadDataDistanceDomicileTravail();
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsTypeContratCDI() {
    if (this.typeContrat != TypeContratTravailEnum.CDI) {
      this.typeContrat = TypeContratTravailEnum.CDI;
      this.futurTravail.typeContrat = this.typeContrat;
      this.unsetNombreMoisContrat();
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsTypeContratCDD() {
    if (this.typeContrat != TypeContratTravailEnum.CDD) {
      this.typeContrat = TypeContratTravailEnum.CDD;
      this.futurTravail.typeContrat = this.typeContrat;
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsTypeContratInterim() {
    if (this.typeContrat != TypeContratTravailEnum.INTERIM) {
      this.typeContrat = TypeContratTravailEnum.INTERIM;
      this.futurTravail.typeContrat = this.typeContrat;
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsTypeContratIAE() {
    if (this.typeContrat != TypeContratTravailEnum.IAE) {
      this.typeContrat = TypeContratTravailEnum.IAE;
      this.futurTravail.typeContrat = this.typeContrat;
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsDureeHebdoTempsPlein() {
    if (this.typeDureeHebdo != TypeDureeHebdoEnum.TEMPS_PLEIN) {
      this.setDureeHebdoTempsPlein();
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsDureeHebdoMiTemps() {
    if (this.typeDureeHebdo != TypeDureeHebdoEnum.MI_TEMPS) {
      this.setDureeHebdoMiTemps();
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsDureeHebdoAutre() {
    if (this.typeDureeHebdo != TypeDureeHebdoEnum.AUTRE) {
      this.setDureeHebdoAutre();
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsSalaireSouhaiteSMIC() {
    if (this.typeSalaireSouhaite != TypeSalaireSouhaiteEnum.SMIC) {
      this.setSalaireSouhaiteSMIC();
    }
    this.isFuturTravailFormSubmitted = false;
  }

  public onClickCheckBoxIsSalaireSouhaiteAutre() {
    if (this.typeSalaireSouhaite != TypeSalaireSouhaiteEnum.AUTRE) {
      this.setSalaireSouhaiteAutre();
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
    this.futurTravail.nombreTrajetsDomicileTravail = Math.floor(nombreTrajetsSemaine * 4.33 * 2);
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
      this.onClickCheckBoxIsTypeContratCDI();
    }
  }

  public handleKeyUpOnButtonIsTypeContratCDD(event: any) {
    if (event.keyCode === 13) {
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
        case TypeSalaireDisplayEnum.MENSUEL_NET:
          this.salaireService.calculSalaireFromMensuelNet(this.futurTravail);
          break;
        case TypeSalaireDisplayEnum.MENSUEL_BRUT:
          this.salaireService.calculSalaireFromMensuelBrut(this.futurTravail);
          break;
        case TypeSalaireDisplayEnum.HORAIRE_NET:
          this.salaireService.calculSalaireFromHoraireNet(this.futurTravail);
          break;
        case TypeSalaireDisplayEnum.HORAIRE_BRUT:
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
    if (!this.hasOffreEmploi) {
      if (this.typeSalaireSouhaite == TypeSalaireSouhaiteEnum.SMIC) {
        this.setSalaireSouhaiteSMIC();
      } else if (this.typeSalaireSouhaite == TypeSalaireSouhaiteEnum.AUTRE) {
        this.setSalaireSouhaiteAutre();
      }
    }
  }

  public getMontantSmicMensuelNet() {
    return this.salaireService.getSmicMensuelNetFromNombreHeure(this.futurTravail.nombreHeuresTravailleesSemaine)
  }

  public afficherNombreTrajetsDomicileTravail(): boolean {
    return (this.hasOffreEmploi != null) &&
      this.futurTravail.distanceKmDomicileTravail >= ContratTravailComponent.DISTANCE_MINI_AIDE_MOB;
  }

  public unsetNombreMoisContrat(): void {
    this.futurTravail.nombreMoisContratCDD = null;
  }

  public setDureeHebdoTempsPlein() {
    this.typeDureeHebdo = TypeDureeHebdoEnum.TEMPS_PLEIN;
    this.futurTravail.typeDureeHebdo = this.typeDureeHebdo;
    this.futurTravail.nombreHeuresTravailleesSemaine = 35;
  }

  public setDureeHebdoMiTemps() {
    this.typeDureeHebdo = TypeDureeHebdoEnum.MI_TEMPS;
    this.futurTravail.typeDureeHebdo = this.typeDureeHebdo;
    this.futurTravail.nombreHeuresTravailleesSemaine = 20;
  }

  public setDureeHebdoAutre() {
    this.typeDureeHebdo = TypeDureeHebdoEnum.AUTRE;
    this.futurTravail.typeDureeHebdo = this.typeDureeHebdo;
    this.futurTravail.nombreHeuresTravailleesSemaine = null;
  }

  public setSalaireSouhaiteSMIC() {
    this.typeSalaireSouhaite = TypeSalaireSouhaiteEnum.SMIC;
    this.futurTravail.typeSalaireSouhaite = this.typeSalaireSouhaite
    this.futurTravail.salaire.montantMensuelNet = this.getMontantSmicMensuelNet();
    this.futurTravail.salaire.montantMensuelBrut = this.salaireService.getBrutFromNet(this.futurTravail.salaire.montantMensuelNet, this.futurTravail.typeContrat, this.futurTravail.nombreHeuresTravailleesSemaine);
    this.futurTravail.salaire.montantHoraireNet = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelNet, this.futurTravail.nombreHeuresTravailleesSemaine);
    this.futurTravail.salaire.montantHoraireBrut = this.salaireService.getMontantHoraireFromMontantMensuel(this.futurTravail.salaire.montantMensuelBrut, this.futurTravail.nombreHeuresTravailleesSemaine);
  }

  public setSalaireSouhaiteAutre() {
    this.typeSalaireSouhaite = TypeSalaireSouhaiteEnum.AUTRE;
    this.futurTravail.typeSalaireSouhaite = this.typeSalaireSouhaite;
  }

  public setNombreTrajets1JourSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.typeNombreTrajetsSemaine = TypeNombreTrajetsSemaineEnum.UN;
    this.futurTravail.typeNombreTrajetsSemaine = this.typeNombreTrajetsSemaine;
    this.setNombreTrajetsDomicileTravail(1);
  }

  public setNombreTrajets2JoursSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.typeNombreTrajetsSemaine = TypeNombreTrajetsSemaineEnum.DEUX;
    this.futurTravail.typeNombreTrajetsSemaine = this.typeNombreTrajetsSemaine;
    this.setNombreTrajetsDomicileTravail(2);
  }

  public setNombreTrajets3JoursSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.typeNombreTrajetsSemaine = TypeNombreTrajetsSemaineEnum.TROIS;
    this.futurTravail.typeNombreTrajetsSemaine = this.typeNombreTrajetsSemaine;
    this.setNombreTrajetsDomicileTravail(3);
  }

  public setNombreTrajets4JoursSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.typeNombreTrajetsSemaine = TypeNombreTrajetsSemaineEnum.QUATRE;
    this.futurTravail.typeNombreTrajetsSemaine = this.typeNombreTrajetsSemaine;
    this.setNombreTrajetsDomicileTravail(4);
  }

  public setNombreTrajets5JoursSemaine() {
    this.unsetNombreTrajetsDomicileTravail();
    this.typeNombreTrajetsSemaine = TypeNombreTrajetsSemaineEnum.CINQ;
    this.futurTravail.typeNombreTrajetsSemaine = this.typeNombreTrajetsSemaine;
    this.setNombreTrajetsDomicileTravail(5);
  }

  public unsetNombreTrajetsDomicileTravail() {
    this.typeNombreTrajetsSemaine = null;
    this.futurTravail.typeNombreTrajetsSemaine = null;
  }

  public setDistanceDomicileTravailEntre0Et9() {
    this.unsetDistanceDomicileTravail();
    this.typeDistanceDomicileTravail = TypeDistanceDomicileTravailEnum.ENTRE_0_ET_9;
    this.futurTravail.typeDistanceDomicileTravail = this.typeDistanceDomicileTravail;
    this.futurTravail.distanceKmDomicileTravail = 5;
  }

  public setDistanceDomicileTravailEntre10Et19() {
    this.unsetDistanceDomicileTravail();
    this.typeDistanceDomicileTravail = TypeDistanceDomicileTravailEnum.ENTRE_10_ET_19;
    this.futurTravail.typeDistanceDomicileTravail = this.typeDistanceDomicileTravail;
    this.futurTravail.distanceKmDomicileTravail = 15;
  }

  public setDistanceDomicileTravailEntre20Et30() {
    this.unsetDistanceDomicileTravail();
    this.typeDistanceDomicileTravail = TypeDistanceDomicileTravailEnum.ENTRE_20_ET_30;
    this.futurTravail.typeDistanceDomicileTravail = this.typeDistanceDomicileTravail;
    this.futurTravail.distanceKmDomicileTravail = 25;
  }

  public setDistanceDomicileTravailPlusDe30() {
    this.unsetDistanceDomicileTravail();
    this.typeDistanceDomicileTravail = TypeDistanceDomicileTravailEnum.PLUS_DE_30;
    this.futurTravail.typeDistanceDomicileTravail = this.typeDistanceDomicileTravail;
  }

  public unsetDistanceDomicileTravail() {
    this.typeDistanceDomicileTravail = null;
    this.futurTravail.typeDistanceDomicileTravail = null;
  }

  // GESTION DES ERREURS DE FORMULAIRE

  public isChampFuturContratInvalide(): boolean {
    return (this.isFuturTravailFormSubmitted && this.isTypeContratInvalide());
  }


  public isChampDureeHebdomadaireInvalide(dureeHebdomadaire): boolean {
    return this.isChampDureeHebdomadaireEgalAZero(dureeHebdomadaire)
      || this.isChampDureeHebdomadaireNonPresent(dureeHebdomadaire)
      || this.isChampDureeHebdomadaireErreurMontantMaxDepasse(dureeHebdomadaire);
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
        !this.typeNombreTrajetsSemaine == null
        || (this.typeNombreTrajetsSemaine != TypeNombreTrajetsSemaineEnum.UN
          && this.typeNombreTrajetsSemaine != TypeNombreTrajetsSemaineEnum.DEUX
          && this.typeNombreTrajetsSemaine != TypeNombreTrajetsSemaineEnum.TROIS
          && this.typeNombreTrajetsSemaine != TypeNombreTrajetsSemaineEnum.QUATRE
          && this.typeNombreTrajetsSemaine != TypeNombreTrajetsSemaineEnum.CINQ)
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
      )) && (
        this.futurTravail.salaire.montantMensuelBrut == null
        || this.futurTravail.salaire.montantHoraireBrut == null
        || this.futurTravail.salaire.montantMensuelNet == null
        || this.futurTravail.salaire.montantHoraireNet == null
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
    return ((this.isFuturTravailFormSubmitted || salaireMensuelNet?.touched) && (this.typeSalaireSouhaite == TypeSalaireSouhaiteEnum.AUTRE && !this.futurTravail.salaire.montantMensuelNet));
  }

  public isChampSalaireSouhaiteErreurMontant(salaireMensuelNet): boolean {
    return ((this.isFuturTravailFormSubmitted || salaireMensuelNet?.touched) && salaireMensuelNet?.errors?.pattern);
  }

  public isSalaireSouhaiteNonSelectionne(): boolean {
    return (this.isFuturTravailFormSubmitted
      && (
        !this.hasOffreEmploi && (
          this.typeSalaireSouhaite != TypeSalaireSouhaiteEnum.SMIC
          && this.typeSalaireSouhaite != TypeSalaireSouhaiteEnum.AUTRE
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
        !this.hasOffreEmploi &&
        (this.typeDureeHebdo == null)
        || (
          (this.typeDureeHebdo != TypeDureeHebdoEnum.TEMPS_PLEIN)
          && (this.typeDureeHebdo != TypeDureeHebdoEnum.MI_TEMPS)
          && (this.typeDureeHebdo != TypeDureeHebdoEnum.AUTRE)
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
        this.typeDureeHebdo == TypeDureeHebdoEnum.AUTRE
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
      && (this.typeDistanceDomicileTravail == TypeDistanceDomicileTravailEnum.PLUS_DE_30 && this.futurTravail.distanceKmDomicileTravail < 30);
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
        !this.hasOffreEmploi && (
          this.typeDistanceDomicileTravail != TypeDistanceDomicileTravailEnum.ENTRE_0_ET_9
          && this.typeDistanceDomicileTravail != TypeDistanceDomicileTravailEnum.ENTRE_10_ET_19
          && this.typeDistanceDomicileTravail != TypeDistanceDomicileTravailEnum.ENTRE_20_ET_30
          && this.typeDistanceDomicileTravail != TypeDistanceDomicileTravailEnum.PLUS_DE_30
        )
      )
    );
  }
}
