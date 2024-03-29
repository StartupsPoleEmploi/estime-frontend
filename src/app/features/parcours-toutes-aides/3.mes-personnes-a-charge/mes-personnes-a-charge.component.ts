import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeadlineEnum } from '@app/commun/enumerations/page-headline.enum';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { RessourcesFinancieresAvantSimulationUtileService } from '@app/core/services/utile/ressources-financieres-avant-simulation-utile.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { DateDecomposee } from '@models/date-decomposee';
import { Personne } from '@models/personne';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { ModalService } from '@app/core/services/utile/modal.service';

@Component({
  selector: 'app-mes-personnes-a-charge',
  templateUrl: './mes-personnes-a-charge.component.html',
  styleUrls: ['./mes-personnes-a-charge.component.scss']
})
export class MesPersonnesAChargeComponent implements OnInit {

  dateNaissanceNouvellePersonne: DateDecomposee;
  nouvellePersonneACharge: Personne;
  numeroNouvellePersonne: number;
  PageHeadlineEnum: typeof PageHeadlineEnum = PageHeadlineEnum;

  isModeModification = false;
  isNouvellePersonneAChargeFormDisplay = false;

  personnesACharge: Array<Personne>;
  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;


  constructor(
    private router: Router,
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    public modalService: ModalService,
    public personneUtileService: PersonneUtileService,
    private ressourcesFinancieresAvantSimulationUtileService: RessourcesFinancieresAvantSimulationUtileService,
    public screenService: ScreenService
  ) {
  }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    this.loadDataPersonnesACharge();
    this.controleChampFormulaireService.focusOnFirstElement();
  }

  public onClickButtonAjouterPersonne(): void {
    this.isNouvellePersonneAChargeFormDisplay = true;
    this.nouvellePersonneACharge = this.personneUtileService.creerPersonne(false);
    this.numeroNouvellePersonne = this.personnesACharge.length + 1;
    this.dateNaissanceNouvellePersonne = this.dateUtileService.creerDateDecomposee("de naissance de la personne à charge " + this.numeroNouvellePersonne, "DateNaissancePersonneACharge");
  }

  public onClickButtonModifierPersonneACharge(personneAModifier: Personne, indexPersonneAModifier: number): void {
    this.nouvellePersonneACharge = { ...personneAModifier };
    this.isNouvellePersonneAChargeFormDisplay = true;
    this.isModeModification = true;
    this.numeroNouvellePersonne = indexPersonneAModifier + 1;
    this.dateNaissanceNouvellePersonne = this.dateUtileService.getDateDecomposeeFromStringDate(personneAModifier.informationsPersonnelles.dateNaissance, "de naissance de la personne à charge " + indexPersonneAModifier, "DateNaissancePersonneACharge");
  }

  public onClickButtonSupprimerPersonneACharge(index: number): void {
    this.personnesACharge.splice(index, 1);
    this.deConnecteService.setPersonnesACharge(this.personnesACharge);
    if (this.numeroNouvellePersonne === index + 1) {
      this.isNouvellePersonneAChargeFormDisplay = false;
      this.isModeModification = false;
    }
    if (!this.deConnecteSituationFamilialeService.hasPersonneAChargeSuperieur(0)) {
      this.deConnecteService.unsetAidesFamiliales();
    } else {
      if (!this.deConnecteSituationFamilialeService.hasPersonneAChargeMoinsDe3Ans()) {
        this.deConnecteService.unsetAllocationPAJE();
      }
      if (!this.deConnecteSituationFamilialeService.has3PersonnesAChargeEntre3Et21Ans()) {
        this.deConnecteService.unsetComplementFamilial();
      }
      if (!this.deConnecteSituationFamilialeService.hasPersonneAChargeSuperieur(1)) {
        this.deConnecteService.unsetAllocationsFamiliales();
      }
    }
  }

  public onClickButtonPasDePersonneACharge(): void {
    this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.RESSOURCES_ACTUELLES]);
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.SITUATION]);
  }

  public onClickButtonSuivant(): void {
    this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.RESSOURCES_ACTUELLES]);
  }

  public traiterAjoutePersonneEvent(isAjoutPersonneSubmit: boolean): void {
    if (isAjoutPersonneSubmit) {
      if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation) {
        this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation = this.ressourcesFinancieresAvantSimulationUtileService.replaceCommaByDotMontantsRessourcesFinancieresAvantSimulation(this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation);
      }
      if (!this.isModeModification) {
        this.personnesACharge.push(this.nouvellePersonneACharge);
      } else {
        this.personnesACharge[this.numeroNouvellePersonne - 1] = this.nouvellePersonneACharge;
      }

      this.deConnecteService.setPersonnesACharge(this.personnesACharge);
    }
    this.isModeModification = false;
    this.isNouvellePersonneAChargeFormDisplay = false;
  }

  private loadDataPersonnesACharge() {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      this.personnesACharge = demandeurEmploiConnecte.situationFamiliale.personnesACharge;
    } else {
      this.personnesACharge = new Array<Personne>();
    }
  }

  public hasPersonneACharge(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale.personnesACharge && demandeurEmploiConnecte.situationFamiliale.personnesACharge.length > 0) return true
    return false;
  }

  /******* */

  public handleKeyUpOnButtonAjouterPersonne(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonAjouterPersonne();
    }
  }

  public handleKeyUpOnButtonModifierPersonneACharge(event: any, personneAModifier: Personne, indexPersonneAModifier: number) {
    if (event.keyCode === 13) {
      this.onClickButtonModifierPersonneACharge(personneAModifier, indexPersonneAModifier);
    }
  }

  public handleKeyUpOnButtonSupprimerPersonne(event: any, index: number) {
    if (event.keyCode === 13) {
      this.onClickButtonSupprimerPersonneACharge(index);
    }
  }

  public handleKeyUpOnButtonPasDePersonneACharge(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonPasDePersonneACharge();
    }
  }
}
