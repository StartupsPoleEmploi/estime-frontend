import { Component, Input, OnInit } from '@angular/core';
import { Personne } from '@models/personne';
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DeConnecteBenefiaireAidesSocialesService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-benefiaire-aides-sociales.service';
import { Salaire } from '@app/commun/models/salaire';

@Component({
  selector: 'app-form-personne-a-charge-situation',
  templateUrl: './form-personne-a-charge-situation.component.html',
  styleUrls: ['./form-personne-a-charge-situation.component.scss']
})
export class FormPersonneAChargeSituationComponent implements OnInit {

  @Input() nouvellePersonneACharge: Personne;
  @Input() isNouvellePersonnesAChargeFormSubmitted: boolean;
  @Input() isSituationNotValide: boolean;

  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public deConnecteBenefiaireAidesSocialesService: DeConnecteBenefiaireAidesSocialesService
  ) { }

  ngOnInit(): void {
  }

  public onClickCheckBoxHasAAH(): void {
    if(!this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireAAH) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxHasARE(): void {
    if(!this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireARE) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNet = 0;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxHasASS(): void {
    if(!this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireASS) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNet = 0;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxHasRSA(): void {
    if(!this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireRSA) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = 0;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxIsMicroEntrepreneur(): void {
    if (!this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur) {
      this.unsetRevenusMicroEntrepreneur();
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
      this.unsetBeneficesTravailleurIndependant();
    }
  }

  public onClickCheckBoxIsTravailleurIndependant(): void {
    if (!this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant) {
      this.unsetBeneficesTravailleurIndependant();
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
      this.unsetRevenusMicroEntrepreneur();
    }
  }

  public onClickCheckBoxHasPensionInvalidite(): void {
    if(!this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiairePensionInvalidite) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCPAM.pensionInvalidite = null;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxIsSalarie(): void {
    if(!this.nouvellePersonneACharge.informationsPersonnelles.salarie) {
      this.nouvellePersonneACharge.ressourcesFinancieres.salaire = null;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.salaire = new Salaire();
    }
  }

  public onClickCheckBoxIsSansRessource(): void {
    this.unsetSalaire();
    this.unsetRessourcesAllocations();
    this.unsetRevenusMicroEntrepreneur();
    this.unsetBeneficesTravailleurIndependant();
  }

  public handleKeyUpOnButtonSituation(e: any, situationConjoint: string) {
    if (e.keyCode === 13) {
      if(situationConjoint === this.situationPersonneEnum.AAH) {
        this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireAAH = !this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireAAH;
        this.onClickCheckBoxHasAAH();
      }
      if(situationConjoint === this.situationPersonneEnum.SALARIE) {
        this.nouvellePersonneACharge.informationsPersonnelles.salarie = !this.nouvellePersonneACharge.informationsPersonnelles.salarie;
        this.onClickCheckBoxIsSalarie();
      }
      if(situationConjoint === this.situationPersonneEnum.RSA) {
        this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireRSA = !this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireRSA;
        this.onClickCheckBoxHasRSA();
      }
      if(situationConjoint === this.situationPersonneEnum.ARE) {
        this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireARE = !this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireARE;
        this.onClickCheckBoxHasARE();
      }
      if(situationConjoint === this.situationPersonneEnum.ASS) {
        this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireASS = !this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireASS;
        this.onClickCheckBoxHasASS();
      }
      if(situationConjoint === this.situationPersonneEnum.PENSION_INVALIDITE) {
        this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiairePensionInvalidite = !this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiairePensionInvalidite;
        this.onClickCheckBoxHasPensionInvalidite();
      }
      if(situationConjoint === this.situationPersonneEnum.MICRO_ENTREPRENEUR) {
        this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur = !this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur;
        this.onClickCheckBoxIsMicroEntrepreneur();
      }
      if(situationConjoint === this.situationPersonneEnum.TRAVAILLEUR_INDEPENDANT) {
        this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant = !this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant;
        this.onClickCheckBoxIsTravailleurIndependant();
      }
      if(situationConjoint === this.situationPersonneEnum.SANS_RESSOURCE) {
        this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = !this.nouvellePersonneACharge.informationsPersonnelles.sansRessource;
        this.onClickCheckBoxIsSansRessource();
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

  private unsetAAH(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireAAH = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
    }
  }

  private unsetASS(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireASS = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNet = null;
    }
  }

  private unsetARE(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireARE= false;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNet = null;
    }
  }

  private unsetRSA(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireRSA = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
    }
  }

  private unsetRevenusMicroEntrepreneur(): void {
    if(this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur) {
      this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.revenusMicroEntreprise3DerniersMois = null;
    }
  }

  private unsetBeneficesTravailleurIndependant(): void {
    if(this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant) {
      this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice = null;
    }
  }

  private unsetPensionInvalidite(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCPAM) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiairePensionInvalidite = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCPAM.pensionInvalidite = null;
    }
  }
}
