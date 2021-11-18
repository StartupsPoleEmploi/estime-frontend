import { Component, Input, OnInit } from '@angular/core';
import { Personne } from '@models/personne';
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DeConnecteBeneficiaireAidesService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service';
import { Salaire } from '@app/commun/models/salaire';
import { RessourcesFinancieresUtileService } from '@app/core/services/utile/ressources-financieres-utiles.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';

@Component({
  selector: 'app-form-personne-a-charge-situation',
  templateUrl: './form-personne-a-charge-situation.component.html',
  styleUrls: ['./form-personne-a-charge-situation.component.scss']
})
export class FormPersonneAChargeSituationComponent implements OnInit {

  @Input() nouvellePersonneACharge: Personne;
  @Input() isNouvellePersonnesAChargeFormSubmitted: boolean;
  @Input() isSituationNotValide: boolean;
  beneficiaireAides: BeneficiaireAides;

  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public ressourcesFinancieresUtileService: RessourcesFinancieresUtileService,
    public deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    public deConnecteService: DeConnecteService
  ) { }

  ngOnInit(): void { }

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

  public onClickCheckBoxIsSalarie(event): void {
    event.preventDefault();
    if (!this.nouvellePersonneACharge.informationsPersonnelles.salarie) {
      this.nouvellePersonneACharge.ressourcesFinancieres.salaire = null;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.salaire = new Salaire();
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
        this.nouvellePersonneACharge.beneficiaireAides.beneficiaireAAH = !this.nouvellePersonneACharge.beneficiaireAides.beneficiaireAAH;
        this.onClickCheckBoxHasAAH(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.SALARIE) {
        this.nouvellePersonneACharge.informationsPersonnelles.salarie = !this.nouvellePersonneACharge.informationsPersonnelles.salarie;
        this.onClickCheckBoxIsSalarie(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.RSA) {
        this.nouvellePersonneACharge.beneficiaireAides.beneficiaireRSA = !this.nouvellePersonneACharge.beneficiaireAides.beneficiaireRSA;
        this.onClickCheckBoxHasRSA(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.ARE) {
        this.nouvellePersonneACharge.beneficiaireAides.beneficiaireARE = !this.nouvellePersonneACharge.beneficiaireAides.beneficiaireARE;
        this.onClickCheckBoxHasARE(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.ASS) {
        this.nouvellePersonneACharge.beneficiaireAides.beneficiaireASS = !this.nouvellePersonneACharge.beneficiaireAides.beneficiaireASS;
        this.onClickCheckBoxHasASS(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.PENSION_INVALIDITE) {
        this.nouvellePersonneACharge.beneficiaireAides.beneficiairePensionInvalidite = !this.nouvellePersonneACharge.beneficiaireAides.beneficiairePensionInvalidite;
        this.onClickCheckBoxHasPensionInvalidite(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.MICRO_ENTREPRENEUR) {
        this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur = !this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur;
        this.onClickCheckBoxIsMicroEntrepreneur(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.TRAVAILLEUR_INDEPENDANT) {
        this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant = !this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant;
        this.onClickCheckBoxIsTravailleurIndependant(e);
      }
      else if (situationPersonneACharge === this.situationPersonneEnum.SANS_RESSOURCE) {
        this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = !this.nouvellePersonneACharge.informationsPersonnelles.sansRessource;
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
    this.nouvellePersonneACharge.ressourcesFinancieres.salaire = null;
  }

  private setAAH(): void {
    this.setAidesCAF();
    if (this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF
      && !this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF.allocationAAH) {
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF.allocationAAH = null;
    }
  }

  private unsetAAH(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireAAH = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF.allocationAAH = null;
    }
  }

  private setASS(): void {
    this.setAidesPoleEmploi();
    if (this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi
      && !this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi.allocationASS = this.ressourcesFinancieresUtileService.creerAllocationASS();
      this.unsetARE();
    }
  }

  private unsetASS(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi
      && this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireASS = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationMensuelleNet = null;
    }
  }

  private setARE(): void {
    this.setAidesPoleEmploi();
    if (this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi
      && !this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi.allocationARE) {
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi.allocationARE = this.ressourcesFinancieresUtileService.creerAllocationARE();
      this.unsetASS();
    }
  }

  private unsetARE(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi
      && this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi.allocationARE) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireARE = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationMensuelleNet = null;
    }
  }

  private setRSA(): void {
    this.setAidesCAF();
    if (this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF
      && !this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF.allocationRSA) {
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF.allocationRSA = null;
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF.prochaineDeclarationTrimestrielle = null;
    }
  }

  private unsetRSA(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireRSA = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF.allocationRSA = null;
    }
  }

  private unsetBeneficesMicroEntreprise(): void {
    if (this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur) {
      this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice = null;
    }
  }

  private unsetChiffreAffairesIndependant(): void {
    if (this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant) {
      this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.chiffreAffairesIndependantDernierExercice = null;
    }
  }

  private setPensionInvalidite(): void {
    this.setAidesCPAM();
  }

  private unsetPensionInvalidite(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieres.aidesCPAM) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiairePensionInvalidite = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesCPAM.pensionInvalidite = null;
    }
  }


  private setAidesCAF(): void {
    if (!this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF) {
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesCAF = this.ressourcesFinancieresUtileService.creerAidesCAF();
    }
  }

  private setAidesPoleEmploi(): void {
    if (!this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi) {
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesPoleEmploi = this.ressourcesFinancieresUtileService.creerAidesPoleEmploi();
    }
  }

  private setAidesCPAM(): void {
    if (!this.nouvellePersonneACharge.ressourcesFinancieres.aidesCPAM) {
      this.nouvellePersonneACharge.ressourcesFinancieres.aidesCPAM = this.ressourcesFinancieresUtileService.creerAidesCPAM();
    }
  }
}
