import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { LibellesAidesEnum } from '@app/commun/enumerations/libelles-aides.enum';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { DeConnecteBeneficiaireAidesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service";
import { DeConnecteInfosPersonnellesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-infos-personnelles.service";
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { RessourcesFinancieresUtileService } from '@app/core/services/utile/ressources-financieres-utiles.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { SituationFamilialeUtileService } from '@app/core/services/utile/situation-familiale.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { NumeroProchainMoisDeclarationTrimestrielle } from "@models/numero-prochain-mois-declaration-trimestrielle";
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { SituationFamiliale } from '@models/situation-familiale';
import { StatutOccupationLogementEnum } from '@app/commun/enumerations/statut-occupation-logement.enum';
import { StatutOccupationLogementLibelleEnum } from '@app/commun/enumerations/statut-occupation-logement-libelle.enum';
import { InformationsPersonnellesService } from '@app/core/services/utile/informations-personnelles.service';
import { PopoverDirective } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-ressources-financieres-foyer',
  templateUrl: './ressources-financieres-foyer.component.html',
  styleUrls: ['./ressources-financieres-foyer.component.scss']
})
export class RessourcesFinancieresFoyerComponent implements OnInit {

  isRessourcesFinancieresFoyerFormSubmitted = false;

  @ViewChild('ressourcesFinancieresFoyerForm', { read: NgForm }) ressourcesFinancieresFoyerForm: FormGroup;
  @ViewChild('popoverRevenusImmobiliers') popoverRevenusImmobiliers: PopoverDirective;
  @ViewChild('popoverSituationLogement') popoverSituationLogement: PopoverDirective;

  @Input() ressourcesFinancieres: RessourcesFinancieres;

  @Output() validationRessourcesFoyerEventEmitter = new EventEmitter<void>();

  optionsProchaineDeclarationTrimestrielle: Array<NumeroProchainMoisDeclarationTrimestrielle>;

  informationsPersonnelles: InformationsPersonnelles;
  beneficiaireAides: BeneficiaireAides;
  situationFamiliale: SituationFamiliale;

  libellesAidesEnum: typeof LibellesAidesEnum = LibellesAidesEnum;
  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;
  statutOccupationLogementEnum: typeof StatutOccupationLogementEnum = StatutOccupationLogementEnum;
  statutOccupationLogementLibelleEnum: typeof StatutOccupationLogementLibelleEnum = StatutOccupationLogementLibelleEnum;

  isAucunCas: boolean;


  constructor(
    private elementRef: ElementRef,
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    public deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    private informationsPersonnellesService: InformationsPersonnellesService,
    private ressourcesFinancieresUtileService: RessourcesFinancieresUtileService,
    public screenService: ScreenService,
    private situationFamilialeUtileService: SituationFamilialeUtileService
  ) {
  }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.initOptionsProchaineDeclarationTrimestrielle();
    this.beneficiaireAides = demandeurEmploiConnecte.beneficiaireAides;
    this.loadDataSituationFamiliale(demandeurEmploiConnecte);
    this.loadDataInformationsPersonnelles(demandeurEmploiConnecte);
    this.loadAidesLogement(demandeurEmploiConnecte);
    this.isAucunCas = null;
  }

  public onSubmitRessourcesFinancieresFoyerForm(form: FormGroup): void {
    this.isRessourcesFinancieresFoyerFormSubmitted = true;
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieres);
      this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
      this.validationRessourcesFoyerEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  public onClickPopoverRevenusImmobiliers(event) {
    event.stopPropagation();
  }

  public onClickClosePopoverRevenusImmobiliers(event) {
    event.stopPropagation();
    this.popoverRevenusImmobiliers.hide();
  }

  public onClickCheckBoxHasAPL(): void {
    if (!this.beneficiaireAides.beneficiaireAPL) {
      this.deConnecteService.unsetAPL();
    } else {
      this.deConnecteService.unsetALF();
      this.beneficiaireAides.beneficiaireALF = false;
      this.deConnecteService.unsetALS();
      this.beneficiaireAides.beneficiaireALS = false;
    }
  }

  public onClickCheckBoxHasALF(): void {
    if (!this.beneficiaireAides.beneficiaireALF) {
      this.deConnecteService.unsetALF();
    } else {
      this.deConnecteService.unsetAPL();
      this.beneficiaireAides.beneficiaireAPL = false;
      this.deConnecteService.unsetALS();
      this.beneficiaireAides.beneficiaireALS = false;
    }
  }

  public onClickCheckBoxHasALS(): void {
    if (!this.beneficiaireAides.beneficiaireALS) {
      this.deConnecteService.unsetALS();
    } else {
      this.beneficiaireAides.beneficiaireALS = true;
      this.deConnecteService.unsetAPL();
      this.beneficiaireAides.beneficiaireAPL = false;
      this.deConnecteService.unsetALF();
      this.beneficiaireAides.beneficiaireALF = false;
    }
  }

  public onClickClosePopoverSituationLogement(event): void {
    event.stopPropagation();
    this.popoverSituationLogement.hide();
  }

  private initOptionsProchaineDeclarationTrimestrielle() {
    this.optionsProchaineDeclarationTrimestrielle = new Array<NumeroProchainMoisDeclarationTrimestrielle>();
    for (let i = 0; i < 4; i++) {
      const numeroProchainMoisDeclarationTrimesNumeroProchainMoisDeclarationTrimestrielle = new NumeroProchainMoisDeclarationTrimestrielle();
      numeroProchainMoisDeclarationTrimesNumeroProchainMoisDeclarationTrimestrielle.value = i;
      numeroProchainMoisDeclarationTrimesNumeroProchainMoisDeclarationTrimestrielle.label = this.dateUtileService.getLibelleMoisApresDateJour(i);
      this.optionsProchaineDeclarationTrimestrielle.push(numeroProchainMoisDeclarationTrimesNumeroProchainMoisDeclarationTrimestrielle);
    }
  }

  private loadDataSituationFamiliale(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.situationFamiliale) {
      this.situationFamiliale = demandeurEmploiConnecte.situationFamiliale;
    } else {
      this.situationFamiliale = this.situationFamilialeUtileService.creerSituationFamiliale();
    }
  }

  private loadDataInformationsPersonnelles(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.informationsPersonnelles) {
      this.informationsPersonnelles = demandeurEmploiConnecte.informationsPersonnelles;
    } else {
      this.informationsPersonnelles = this.informationsPersonnellesService.creerInformationsPersonnelles();
    }
  }

  private loadAidesLogement(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.ressourcesFinancieres
      && demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF
      && demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement) {
      this.ressourcesFinancieres.aidesCAF.aidesLogement = demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement;
    } else {
      this.ressourcesFinancieres.aidesCAF.aidesLogement = this.ressourcesFinancieresUtileService.creerAidesLogement();
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    return form.valid && this.deConnecteRessourcesFinancieresService.isDonneesRessourcesFinancieresFoyerValides(this.ressourcesFinancieres, this.informationsPersonnelles);
  }

  public handleKeyUpOnButtonAPL(event: any): void {
    if (event.keyCode === 13) {
      this.beneficiaireAides.beneficiaireAPL = !this.beneficiaireAides.beneficiaireAPL;
      this.onClickCheckBoxHasAPL();
    }
  }

  public handleKeyUpOnButtonALF(event: any): void {
    if (event.keyCode === 13) {
      this.beneficiaireAides.beneficiaireALF = !this.beneficiaireAides.beneficiaireALF;
      this.onClickCheckBoxHasALF();
    }
  }

  public handleKeyUpOnButtonALS(event: any): void {
    if (event.keyCode === 13) {
      this.beneficiaireAides.beneficiaireALS = !this.beneficiaireAides.beneficiaireALS;
      this.onClickCheckBoxHasALS();
    }
  }

  public isAuMoinsUneAideLogementSuperieureAZero(): boolean {
    return (
      (this.beneficiaireAides.beneficiaireAPL
        && (this.ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1 == 0
          && this.ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2 == 0
          && this.ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3 == 0))
      || (this.beneficiaireAides.beneficiaireALF
        && (this.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1 == 0
          && this.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2 == 0
          && this.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3 == 0))
      || (this.beneficiaireAides.beneficiaireALS
        && (this.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1 == 0
          && this.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2 == 0
          && this.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3 == 0))
    );
  }

  /** Gestion des champs logement */



  public onClickCheckBoxIsLocataireNonMeuble(): void {
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble) {
      this.unsetStatutOccupationLogement();
      this.setIsLocataireNonMeuble();
    }

  }

  public onClickCheckBoxIsLocataireMeuble(): void {
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble) {
      this.unsetStatutOccupationLogement();
      this.setIsLocataireMeuble();
    }
  }

  public onClickCheckBoxIsLocataireHLM(): void {
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM) {
      this.unsetStatutOccupationLogement();
      this.setIsLocataireHLM();
    }
  }

  public onClickCheckBoxIsProprietaire(): void {
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire) {
      this.unsetStatutOccupationLogement();
      this.setIsProprietaire();
    }
  }

  public onClickCheckBoxIsProprietaireAvecEmprunt(): void {
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt) {
      this.unsetStatutOccupationLogement();
      this.setIsProprietaireAvecEmprunt();
    }
  }

  public onClickCheckBoxIsLogeGratuitement(): void {
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement) {
      this.unsetStatutOccupationLogement();
      this.setIsLogeGratuitement();
    }
  }

  public onClickPopoverSituationLogement(event) {
    event.stopPropagation();
  }

  public isStatutOccupationLogementSelectionne() {
    return this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM
      || this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire
      || this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement;
  }

  public isConcerneParAideLogement(): boolean {
    return this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble
      || this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt
  }

  public handleKeyUpOnButtonStatutOccupationLogement(event: any, statutOccupationLogementPersonne: string): void {
    if (event.keyCode === 13) {
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.LOCATAIRE_MEUBLE) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble = !this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble;
        this.onClickCheckBoxIsLocataireMeuble();
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.LOCATAIRE_VIDE) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble = !this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble;
        this.onClickCheckBoxIsLocataireNonMeuble();
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.LOCATAIRE_HLM) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM = !this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM;
        this.onClickCheckBoxIsLocataireHLM();
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.PROPRIETAIRE) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire = !this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire;
        this.onClickCheckBoxIsProprietaire();
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.PROPRIETAIRE_AVEC_EMPRUNT) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt = !this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt;
        this.onClickCheckBoxIsProprietaireAvecEmprunt();
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.LOGE_GRATUITEMENT) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement = !this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement;
        this.onClickCheckBoxIsLogeGratuitement();
      }
    }
  }



  public onClickCheckBoxIsCrous(): void {
    if (this.informationsPersonnelles.logement.isCrous) {
      this.isAucunCas = false;
    }

  }

  public onClickCheckBoxIsConventionne(): void {
    if (this.informationsPersonnelles.logement.isConventionne) {
      this.isAucunCas = false;
    }
  }

  public onClickCheckBoxIsColloc(): void {
    if (this.informationsPersonnelles.logement.isColloc) {
      this.isAucunCas = false;
    }
  }

  public onClickCheckBoxIsChambre(): void {
    if (this.informationsPersonnelles.logement.isChambre) {
      this.isAucunCas = false;
    }
  }

  public onClickCheckBoxIsAucunCas(): void {
    this.unsetTypeLogement();
    this.isAucunCas = true;
  }


  public handleKeyUpOnButtonIsCrous(event: any): void {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.logement.isCrous = !this.informationsPersonnelles.logement.isCrous;
    }
  }
  public handleKeyUpOnButtonIsConventionne(event: any): void {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.logement.isConventionne = !this.informationsPersonnelles.logement.isConventionne;
    }
  }
  public handleKeyUpOnButtonIsColloc(event: any): void {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.logement.isColloc = !this.informationsPersonnelles.logement.isColloc;
    }
  }
  public handleKeyUpOnButtonIsChambre(event: any): void {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.logement.isChambre = !this.informationsPersonnelles.logement.isChambre;
    }
  }
  public handleKeyUpOnButtonIsAucunCas(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsAucunCas();
    }
  }

  public unsetStatutOccupationLogement(): void {
    this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble = false;
    this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble = false;
    this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM = false;
    this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire = false;
    this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt = false;
    this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement = false;
    this.unsetTypeLogement();
  }

  public setIsLocataireMeuble(): void {
    this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble = true;
  }

  public setIsLocataireNonMeuble(): void {
    this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble = true;
  }

  public setIsLocataireHLM(): void {
    this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM = true;
  }

  public setIsProprietaire(): void {
    this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire = true;
  }

  public setIsProprietaireAvecEmprunt(): void {
    this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt = true;
  }

  public setIsLogeGratuitement(): void {
    this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement = true;
  }

  private unsetTypeLogement(): void {
    this.informationsPersonnelles.logement.isCrous = false;
    this.informationsPersonnelles.logement.isConventionne = false;
    this.informationsPersonnelles.logement.isChambre = false;
    this.informationsPersonnelles.logement.isColloc = false;
  }
}
