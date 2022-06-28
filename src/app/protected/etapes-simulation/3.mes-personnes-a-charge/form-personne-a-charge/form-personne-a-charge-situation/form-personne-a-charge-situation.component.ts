import { Component, Input, OnInit } from '@angular/core';
import { Personne } from '@models/personne';
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DeConnecteBeneficiaireAidesService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service';
import { Salaire } from '@app/commun/models/salaire';
import { RessourcesFinancieresAvantSimulationUtileService } from '@app/core/services/utile/ressources-financieres-avant-simulation-utile.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { DateDecomposee } from '@app/commun/models/date-decomposee';

@Component({
  selector: 'app-form-personne-a-charge-situation',
  templateUrl: './form-personne-a-charge-situation.component.html',
  styleUrls: ['./form-personne-a-charge-situation.component.scss']
})
export class FormPersonneAChargeSituationComponent implements OnInit {

  @Input() nouvellePersonneACharge: Personne;
  @Input() isNouvellePersonnesAChargeFormSubmitted: boolean;
  @Input() dateNaissanceNouvellePersonne: DateDecomposee;
  @Input() isSituationNotValide: boolean;
  beneficiaireAides: BeneficiaireAides;

  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public ressourcesFinancieresAvantSimulationUtileService: RessourcesFinancieresAvantSimulationUtileService,
    public personneUtileService: PersonneUtileService,
    public deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    public deConnecteService: DeConnecteService
  ) { }

  ngOnInit(): void { }

  public hasAgeEligibleRetraite(): boolean {
    return this.personneUtileService.isAgeEligibleRetraite(this.dateNaissanceNouvellePersonne);
  }

  public onClickCheckBoxHasAAH(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.beneficiaireAides.beneficiaireAAH) {
      this.unsetAAH();
    } else {
      this.setAAH();
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxHasARE(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.beneficiaireAides.beneficiaireARE) {
      this.unsetARE();
    } else {
      this.setARE();
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxHasASS(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.beneficiaireAides.beneficiaireASS) {
      this.unsetASS();
    } else {
      this.setASS();
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxHasRSA(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.beneficiaireAides.beneficiaireRSA) {
      this.unsetRSA();
    } else {
      this.setRSA();
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxIsMicroEntrepreneur(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur) {
      this.unsetBeneficesMicroEntreprise();
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
      this.unsetChiffreAffairesIndependant();
    }
  }

  public onClickCheckBoxIsTravailleurIndependant(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant) {
      this.unsetChiffreAffairesIndependant();
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
      this.unsetBeneficesMicroEntreprise();
    }
  }

  public onClickCheckBoxHasPensionInvalidite(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.beneficiaireAides.beneficiairePensionInvalidite) {
      this.unsetPensionInvalidite();
    } else {
      this.setPensionInvalidite();
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxHasPensionRetraite(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.beneficiaireAides.beneficiairePensionInvalidite) {
      this.unsetPensionRetraite();
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxIsSalarie(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.informationsPersonnelles.salarie) {
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.salaire = null;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.salaire = new Salaire();
    }
  }

  public onClickCheckBoxIsSansRessource(event): void {
    event.preventDefault();
    this.unsetSalaire();
    this.unsetRessourcesAllocations();
    this.unsetBeneficesMicroEntreprise();
    this.unsetChiffreAffairesIndependant();
  }

  public handleKeyUpOnButtonSituation(e: any, situationPersonneACharge: string) {
    if (e.keyCode === 13) {
      if (situationPersonneACharge === this.situationPersonneEnum.AAH) {
        this.onClickCheckBoxHasAAH(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.SALARIE) {
        this.onClickCheckBoxIsSalarie(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.RSA) {
        this.onClickCheckBoxHasRSA(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.ARE) {
        this.onClickCheckBoxHasARE(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.ASS) {
        this.onClickCheckBoxHasASS(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.PENSION_INVALIDITE) {
        this.onClickCheckBoxHasPensionInvalidite(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.PENSION_RETRAITE) {
        this.onClickCheckBoxHasPensionRetraite(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.MICRO_ENTREPRENEUR) {
        this.onClickCheckBoxIsMicroEntrepreneur(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.TRAVAILLEUR_INDEPENDANT) {
        this.onClickCheckBoxIsTravailleurIndependant(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.SANS_RESSOURCE) {
        this.onClickCheckBoxIsSansRessource(e);
      }
    }
  }

  private unsetRessourcesAllocations(): void {
    this.unsetARE();
    this.unsetASS();
    this.unsetAAH();
    this.unsetRSA();
    this.unsetPensionInvalidite();
  }

  private unsetSalaire(): void {
    this.nouvellePersonneACharge.informationsPersonnelles.salarie = false;
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.salaire = null;
  }

  private setAAH(): void {
    this.setAidesCAF();
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF
      && !this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH) {
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH = null;
    }
  }

  private unsetAAH(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireAAH = false;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH = null;
    }
  }

  private setASS(): void {
    this.setAidesPoleEmploi();
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && !this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS) {
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS = this.ressourcesFinancieresAvantSimulationUtileService.creerAllocationASS();
      this.unsetARE();
    }
  }

  private unsetASS(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireASS = false;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationMensuelleNet = null;
    }
  }

  private setARE(): void {
    this.setAidesPoleEmploi();
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && !this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE) {
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE = this.ressourcesFinancieresAvantSimulationUtileService.creerAllocationARE();
      this.unsetASS();
    }
  }

  private unsetARE(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireARE = false;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationMensuelleNet = null;
    }
  }

  private setRSA(): void {
    this.setAidesCAF();
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF
      && !this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA) {
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA = null;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF.prochaineDeclarationTrimestrielle = null;
    }
  }

  private unsetRSA(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireRSA = false;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA = null;
    }
  }

  private unsetBeneficesMicroEntreprise(): void {
    if (this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur) {
      this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur = false;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice = null;
    }
  }

  private unsetChiffreAffairesIndependant(): void {
    if (this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant) {
      this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant = false;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice = null;
    }
  }

  private setPensionInvalidite(): void {
    this.setAidesCPAM();
  }

  private unsetPensionInvalidite(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCPAM) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiairePensionInvalidite = false;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite = null;
    }
  }
  private unsetPensionRetraite(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.pensionRetraite) {
      this.nouvellePersonneACharge.informationsPersonnelles.hasPensionRetraite = false;
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.pensionRetraite = null;
    }
  }

  private setAidesCAF(): void {
    if (!this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF) {
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesCAF();
    }
  }

  private setAidesPoleEmploi(): void {
    if (!this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi) {
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesPoleEmploi();
    }
  }

  private setAidesCPAM(): void {
    if (!this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCPAM) {
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCPAM = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesCPAM();
    }
  }
}
