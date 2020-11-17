import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { PersonneUtileService } from "@app/core/services/utile/personne-utile.service";
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

  isModeModification = false;
  isNouvellePersonneAChargeFormDisplay = false;

  personnesACharge: Array<Personne>;
  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;


  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    public personneUtileService: PersonneUtileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDataPersonnesACharge();
  }

  public onClickButtonAjouterPersonne(): void {
    this.isNouvellePersonneAChargeFormDisplay = true;
    this.nouvellePersonneACharge = this.personneUtileService.creerPersonne();
    this.dateNaissanceNouvellePersonne = new DateDecomposee();
    this.numeroNouvellePersonne = this.personnesACharge.length + 1;
  }

  public onClickButtonModifierPersonneACharge(personneAModifier: Personne, indexPersonneAModifier: number): void {
    this.nouvellePersonneACharge = { ...personneAModifier };
    this.dateNaissanceNouvellePersonne = this.dateUtileService.getDateDecomposeeFromStringDate(this.nouvellePersonneACharge.informationsPersonnelles.dateNaissance);
    this.isNouvellePersonneAChargeFormDisplay = true;
    this.isModeModification = true;
    this.numeroNouvellePersonne = indexPersonneAModifier + 1;
  }

  public onClickButtonSupprimerPersonneACharge(index: number): void {
    this.personnesACharge.splice(index, 1);
    this.demandeurEmploiConnecteService.setPersonnesACharge(this.personnesACharge);
    if(this.numeroNouvellePersonne === index + 1) {
      this.isNouvellePersonneAChargeFormDisplay = false;
      this.isModeModification = false;
    }
    if(this.personnesACharge && this.personnesACharge.length === 0) {
      this.demandeurEmploiConnecteService.unsetAllocationsFamiliales();
      this.demandeurEmploiConnecteService.unsetPensionsAlimentaires();
    }
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.MES_INFORMATIONS_PERSONNELLES], { replaceUrl: true });
  }

  public onClickButtonSuivant(): void {
    this.router.navigate([RoutesEnum.RESSOURCES_FINANCIERES], { replaceUrl: true });
  }

  public traiterAjoutePersonneEvent(isAjoutPersonneSubmit: boolean): void {
    if (isAjoutPersonneSubmit) {
      if (!this.isModeModification) {
        this.personnesACharge.push(this.nouvellePersonneACharge);
      }
      this.nouvellePersonneACharge.ressourcesFinancieres = this.demandeurEmploiConnecteService.replaceCommaByDotMontantsRessourcesFinancieres(this.nouvellePersonneACharge.ressourcesFinancieres);
      this.demandeurEmploiConnecteService.setPersonnesACharge(this.personnesACharge);
    }
    this.isModeModification = false;
    this.isNouvellePersonneAChargeFormDisplay = false;
  }



  private loadDataPersonnesACharge() {
    const demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      this.personnesACharge = demandeurEmploiConnecte.situationFamiliale.personnesACharge;
    } else {
      this.personnesACharge = new Array<Personne>();
    }
  }
}
