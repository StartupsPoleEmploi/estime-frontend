import { Component, OnInit, Input } from '@angular/core';
import { Personne } from '@app/commun/models/personne';
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { PersonneUtileService } from "@app/core/services/utile/personne-utile.service";
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';

@Component({
  selector: 'app-form-personne-a-charge-situation',
  templateUrl: './form-personne-a-charge-situation.component.html',
  styleUrls: ['./form-personne-a-charge-situation.component.scss']
})
export class FormPersonneAChargeSituationComponent implements OnInit {

  @Input() nouvellePersonneACharge: Personne;
  @Input() isNouvellePersonnesAChargeFormSubmitted: boolean;

  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public demandeurEmploiConnecteService : DemandeurEmploiConnecteService,
    public personneUtileService: PersonneUtileService
  ) { }

  ngOnInit(): void {
  }

  public onClickCheckBoxIsHandicape(): void {
    if(!this.nouvellePersonneACharge.informationsPersonnelles.isHandicape) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
    }
  }

  public onClickCheckBoxIsSalarie(): void {
    this.nouvellePersonneACharge.informationsPersonnelles.isSansRessource = false;
    if(!this.nouvellePersonneACharge.informationsPersonnelles.isSalarie) {
      this.nouvellePersonneACharge.ressourcesFinancieres.salaireNet = null;
    }
  }

  public onClickCheckBoxHasRessourceAideEmploi(): void {
    this.nouvellePersonneACharge.informationsPersonnelles.isSansRessource= false;
    if(!this.nouvellePersonneACharge.informationsPersonnelles.hasRessourceAideEmploi) {
      this.unsetRessourcesAllocations();
    }
  }

  public onClickCheckBoxIsSansRessource(): void {
    this.nouvellePersonneACharge.informationsPersonnelles.isSalarie = false;
    this.nouvellePersonneACharge.ressourcesFinancieres.salaireNet = null;
    this.nouvellePersonneACharge.informationsPersonnelles.isSansRessource = false;
    this.unsetRessourcesAllocations();
  }

  private unsetRessourcesAllocations(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    }
    if(this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
    }
  }
}
