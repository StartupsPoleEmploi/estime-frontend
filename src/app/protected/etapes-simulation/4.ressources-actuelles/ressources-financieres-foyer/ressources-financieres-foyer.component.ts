import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { LibellesAidesEnum } from '@app/commun/enumerations/libelles-aides.enum';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { DeConnecteBeneficiaireAidesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service";
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { RessourcesFinancieresAvantSimulationUtileService } from '@app/core/services/utile/ressources-financieres-avant-simulation-utile.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { NumeroProchainMoisDeclarationTrimestrielle } from "@models/numero-prochain-mois-declaration-trimestrielle";
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { SituationFamiliale } from '@models/situation-familiale';
import { StatutOccupationLogementEnum } from '@app/commun/enumerations/statut-occupation-logement.enum';
import { StatutOccupationLogementLibelleEnum } from '@app/commun/enumerations/statut-occupation-logement-libelle.enum';
import { ModalService } from '@app/core/services/utile/modal.service';
import { DemandeurEmploiService } from '@app/core/services/utile/demandeur-emploi.service';

@Component({
  selector: 'app-ressources-financieres-foyer',
  templateUrl: './ressources-financieres-foyer.component.html',
  styleUrls: ['./ressources-financieres-foyer.component.scss']
})
export class RessourcesFinancieresFoyerComponent implements OnInit {

  isRessourcesFinancieresFoyerFormSubmitted = false;

  @ViewChild('ressourcesFinancieresFoyerForm', { read: NgForm }) ressourcesFinancieresFoyerForm: FormGroup;

  @Input() ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation;

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
  isNonBeneficiaireAL = false;


  constructor(
    private deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    private demandeurEmploiService: DemandeurEmploiService,
    private ressourcesFinancieresAvantSimulationUtileService: RessourcesFinancieresAvantSimulationUtileService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    public deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    public deConnecteService: DeConnecteService,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    public modalService: ModalService,
    public screenService: ScreenService
  ) {
  }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.initOptionsProchaineDeclarationTrimestrielle();
    this.beneficiaireAides = demandeurEmploiConnecte.beneficiaireAides;
    this.situationFamiliale = this.demandeurEmploiService.loadDataSituationFamiliale(demandeurEmploiConnecte);
    this.informationsPersonnelles = this.demandeurEmploiService.loadDataInformationsPersonnelles(demandeurEmploiConnecte);
    this.loadAidesLogement(demandeurEmploiConnecte);
    this.isAucunCas = null;
  }

  public onSubmitRessourcesFinancieresFoyerForm(form: FormGroup): void {
    this.isRessourcesFinancieresFoyerFormSubmitted = true;
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieresAvantSimulation);
      this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
      this.validationRessourcesFoyerEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  public onClickCheckBoxHasAPL(event: any): void {
    event.preventDefault();
    if (!this.beneficiaireAides.beneficiaireAPL) {
      this.deConnecteService.unsetAPL();
    } else {
      this.isNonBeneficiaireAL = false;
      this.deConnecteService.unsetALF();
      this.beneficiaireAides.beneficiaireALF = false;
      this.deConnecteService.unsetALS();
      this.beneficiaireAides.beneficiaireALS = false;
    }
  }

  public onClickCheckBoxHasALF(event: any): void {
    event.preventDefault();
    if (!this.beneficiaireAides.beneficiaireALF) {
      this.deConnecteService.unsetALF();
    } else {
      this.isNonBeneficiaireAL = false;
      this.deConnecteService.unsetAPL();
      this.beneficiaireAides.beneficiaireAPL = false;
      this.deConnecteService.unsetALS();
      this.beneficiaireAides.beneficiaireALS = false;
    }
  }

  public onClickCheckBoxHasALS(event: any): void {
    event.preventDefault();
    if (!this.beneficiaireAides.beneficiaireALS) {
      this.deConnecteService.unsetALS();
    } else {
      this.isNonBeneficiaireAL = false;
      this.deConnecteService.unsetAPL();
      this.beneficiaireAides.beneficiaireAPL = false;
      this.deConnecteService.unsetALF();
      this.beneficiaireAides.beneficiaireALF = false;
    }
  }

  public onClickCheckBoxPasDAL(event: any): void {
    event.preventDefault();
    if (this.isNonBeneficiaireAL) {
      this.deConnecteService.unsetALS();
      this.beneficiaireAides.beneficiaireALS = false;
      this.deConnecteService.unsetAPL();
      this.beneficiaireAides.beneficiaireAPL = false;
      this.deConnecteService.unsetALF();
      this.beneficiaireAides.beneficiaireALF = false;
    }
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

  private loadAidesLogement(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF
      && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement) {
      this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement = demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement;
    } else {
      this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesLogement();
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    return form.valid && this.deConnecteRessourcesFinancieresAvantSimulationService.isDonneesRessourcesFinancieresAvantSimulationFoyerValides(this.ressourcesFinancieresAvantSimulation, this.informationsPersonnelles);
  }

  public handleKeyUpOnButtonAPL(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxHasAPL(event);
    }
  }

  public handleKeyUpOnButtonALF(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxHasALF(event);
    }
  }

  public handleKeyUpOnButtonALS(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxHasALS(event);
    }
  }

  public handleKeyUpOnButtonPasDAL(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxPasDAL(event);
    }
  }

  public isAuMoinsUneAideLogementSuperieureAZero(): boolean {
    return (
      (this.beneficiaireAides.beneficiaireAPL
        && (this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1 == 0
          && this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2 == 0
          && this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3 == 0))
      || (this.beneficiaireAides.beneficiaireALF
        && (this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1 == 0
          && this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2 == 0
          && this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3 == 0))
      || (this.beneficiaireAides.beneficiaireALS
        && (this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1 == 0
          && this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2 == 0
          && this.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3 == 0))
    );
  }

  /** Gestion des champs logement */



  public onClickCheckBoxIsLocataireNonMeuble(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble) {
      this.unsetStatutOccupationLogement();
      this.setIsLocataireNonMeuble();
    }

  }

  public onClickCheckBoxIsLocataireMeuble(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble) {
      this.unsetStatutOccupationLogement();
      this.setIsLocataireMeuble();
    }
  }

  public onClickCheckBoxIsLocataireHLM(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM) {
      this.unsetStatutOccupationLogement();
      this.setIsLocataireHLM();
    }
  }

  public onClickCheckBoxIsProprietaire(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire) {
      this.unsetStatutOccupationLogement();
      this.unsetInformationsLogement();
      this.setIsProprietaire();
    }
  }

  public onClickCheckBoxIsProprietaireAvecEmprunt(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt) {
      this.unsetStatutOccupationLogement();
      this.unsetInformationsLogement();
      this.setIsProprietaireAvecEmprunt();
    }
  }

  public onClickCheckBoxIsLogeGratuitement(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement) {
      this.unsetStatutOccupationLogement();
      this.unsetInformationsLogement();
      this.setIsLogeGratuitement();
    }
  }

  public isStatutOccupationLogementSelectionne() {
    return this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM
      || this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire
      || this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement;
  }

  public hasAideLogement(): boolean {
    return this.isConcerneParAideLogement()
      && (this.beneficiaireAides.beneficiaireALF
        || this.beneficiaireAides.beneficiaireALS
        || this.beneficiaireAides.beneficiaireAPL
      );
  }

  public isConcerneParDeclarationTrimestrielle() {
    return this.deConnecteBeneficiaireAidesService.hasFoyerRSA()
      || this.deConnecteBeneficiaireAidesService.isBeneficiaireAAH()
      || (this.hasAideLogement()
        && !(this.deConnecteSituationFamilialeService.isCelibataireSansEnfant()
          && this.deConnecteBeneficiaireAidesService.isBeneficiaireRSA()
        )
      );
  }

  public isConcerneParAideLogement(): boolean {
    return this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble
      || this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble;
  }

  public handleKeyUpOnButtonStatutOccupationLogement(event: any, statutOccupationLogementPersonne: string): void {
    if (event.keyCode === 13) {
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.LOCATAIRE_MEUBLE) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble = !this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble;
        this.onClickCheckBoxIsLocataireMeuble(event);
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.LOCATAIRE_VIDE) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble = !this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble;
        this.onClickCheckBoxIsLocataireNonMeuble(event);
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.LOCATAIRE_HLM) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM = !this.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM;
        this.onClickCheckBoxIsLocataireHLM(event);
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.PROPRIETAIRE) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire = !this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire;
        this.onClickCheckBoxIsProprietaire(event);
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.PROPRIETAIRE_AVEC_EMPRUNT) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt = !this.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt;
        this.onClickCheckBoxIsProprietaireAvecEmprunt(event);
      }
      if (statutOccupationLogementPersonne === this.statutOccupationLogementEnum.LOGE_GRATUITEMENT) {
        this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement = !this.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement;
        this.onClickCheckBoxIsLogeGratuitement(event);
      }
    }
  }

  public onClickCheckBoxIsCrous(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.isCrous) {
      this.isAucunCas = false;
    }

  }

  public onClickCheckBoxIsConventionne(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.isConventionne) {
      this.isAucunCas = false;
    }
  }

  public onClickCheckBoxIsColloc(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.isColloc) {
      this.isAucunCas = false;
    }
  }

  public onClickCheckBoxIsChambre(event: any): void {
    event.preventDefault();
    if (this.informationsPersonnelles.logement.isChambre) {
      this.isAucunCas = false;
    }
  }

  public onClickCheckBoxIsAucunCas(event: any): void {
    event.preventDefault();
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
      this.onClickCheckBoxIsAucunCas(event);
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

  private unsetInformationsLogement(): void {
    this.informationsPersonnelles.logement.montantLoyer = 0;
    this.informationsPersonnelles.logement.montantCharges = 0;
  }
}
