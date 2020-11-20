import { Component, Input, OnInit } from '@angular/core';
import { Personne } from '@app/commun/models/personne';
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';

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
    public controleChampFormulaireService: ControleChampFormulaireService
  ) { }

  ngOnInit(): void {
  }

  public onClickCheckBoxHasAAH(): void {
    if(!this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireAAH) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource= false;
    }
  }

  public onClickCheckBoxHasARE(): void {
    if(!this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireARE) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = 0;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource= false;
      this.unsetASS();
      this.unsetRSA();
    }
  }

  public onClickCheckBoxHasASS(): void {
    if(!this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireASS) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = 0;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource= false;
      this.unsetARE();
      this.unsetRSA();
    }
  }

  public onClickCheckBoxHasRSA(): void {
    if(!this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireRSA) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = 0;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource= false;
      this.unsetARE();
      this.unsetASS();
    }
  }

  public onClickCheckBoxIsSalarie(): void {
    if(!this.nouvellePersonneACharge.informationsPersonnelles.salarie) {
      this.nouvellePersonneACharge.ressourcesFinancieres.salaireNet = 0;
    } else {
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxIsSansRessource(): void {
    this.unsetSalaire();
    this.unsetRessourcesAllocations();
  }

  private unsetRessourcesAllocations(): void {
    this.unsetARE();
    this.unsetASS();
    this.unsetAAH();
    this.unsetRSA();
  }

  private unsetSalaire(): void {
    this.nouvellePersonneACharge.informationsPersonnelles.salarie = false;
    this.nouvellePersonneACharge.ressourcesFinancieres.salaireNet = 0;
  }

  private unsetAAH(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireAAH = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = 0;
    }
  }

  private unsetASS(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireASS = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = 0;
    }
  }

  private unsetARE(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireARE= false;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = 0;
    }
  }

  private unsetRSA(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireRSA = false;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = 0;
    }
  }
}
