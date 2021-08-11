import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { RessourcesFinancieresUtileService } from '@app/core/services/utile/ressources-financieres-utiles.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { DateDecomposee } from '@models/date-decomposee';
import { Personne } from '@models/personne';


@Component({
  selector: 'app-mes-personnes-a-charge',
  templateUrl: './mes-personnes-a-charge.component.html',
  styleUrls: ['./mes-personnes-a-charge.component.scss']
})
export class MesPersonnesAChargeComponent implements OnInit {

  dateNaissanceNouvellePersonne: DateDecomposee;
  nouvellePersonneACharge: Personne;
  numeroNouvellePersonne: number;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  isModeModification = false;
  isNouvellePersonneAChargeFormDisplay = false;

  personnesACharge: Array<Personne>;
  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    private deConnecteService: DeConnecteService,
    private deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    public personneUtileService: PersonneUtileService,
    private ressourcesFinancieresUtileService: RessourcesFinancieresUtileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDataPersonnesACharge();
  }

  public onClickButtonAjouterPersonne(): void {
    this.isNouvellePersonneAChargeFormDisplay = true;
    this.nouvellePersonneACharge = this.personneUtileService.creerPersonne(false);
    this.dateNaissanceNouvellePersonne = new DateDecomposee();
    this.numeroNouvellePersonne = this.personnesACharge.length + 1;
  }

  public onClickButtonModifierPersonneACharge(personneAModifier: Personne, indexPersonneAModifier: number): void {
    this.nouvellePersonneACharge = { ...personneAModifier };
    this.dateNaissanceNouvellePersonne = this.dateUtileService.getDateDecomposeeFromStringDate(this.nouvellePersonneACharge.informationsPersonnelles.dateNaissance, "date de naissance personne à charge", "DateNaissancePersonneACharge");
    this.isNouvellePersonneAChargeFormDisplay = true;
    this.isModeModification = true;
    this.numeroNouvellePersonne = indexPersonneAModifier + 1;
  }

  public onClickButtonSupprimerPersonneACharge(index: number): void {
    this.personnesACharge.splice(index, 1);
    this.deConnecteService.setPersonnesACharge(this.personnesACharge);
    if(this.numeroNouvellePersonne === index + 1) {
      this.isNouvellePersonneAChargeFormDisplay = false;
      this.isModeModification = false;
    }
    if(!this.deConnecteSituationFamilialeService.hasPersonneAChargeSuperieur(0)) {
      this.deConnecteService.unsetAidesFamiliales();
    } else {
      if(!this.deConnecteSituationFamilialeService.hasPersonneAChargeMoinsDe3Ans()) {
        this.deConnecteService.unsetAlloctionPAJE();
      }
      if(!this.deConnecteSituationFamilialeService.hasPersonneAChargeSuperieur(1)) {
        this.deConnecteService.unsetAllocationsFamiliales();
      }
    }
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.MA_SITUATION]);
  }

  public onClickButtonSuivant(): void {
    this.deConnecteSituationFamilialeService.hasPersonneAChargeMoinsDe3Ans();
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.RESSOURCES_ACTUELLES]);
  }

  public traiterAjoutePersonneEvent(isAjoutPersonneSubmit: boolean): void {
    if (isAjoutPersonneSubmit) {
      if(this.nouvellePersonneACharge.ressourcesFinancieres) {
        this.nouvellePersonneACharge.ressourcesFinancieres = this.ressourcesFinancieresUtileService.replaceCommaByDotMontantsRessourcesFinancieres(this.nouvellePersonneACharge.ressourcesFinancieres);
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

  /******* */

  public handleKeyUpOnButtonAjouterPersonne(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonAjouterPersonne();
    }
  }
}
