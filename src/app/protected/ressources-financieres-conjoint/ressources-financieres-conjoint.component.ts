import { Component, OnInit } from '@angular/core';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { Router } from '@angular/router';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { FormGroup } from '@angular/forms';
import { RoutesEnum } from '@enumerations/routes.enum';
import { Personne } from '@app/commun/models/personne';

@Component({
  selector: 'app-ressources-financieres-conjoint',
  templateUrl: './ressources-financieres-conjoint.component.html',
  styleUrls: ['./ressources-financieres-conjoint.component.scss']
})
export class RessourcesFinancieresConjointComponent implements OnInit {

  isRessourcesFinancieresConjointFormSubmitted = false;
  conjoint: Personne;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    this.conjoint = demandeurEmploiConnecte.situationFamiliale.conjoint;
  }

  onClickButtonRetour() {
    this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
  }

  onSubmitRessourcesFinancieresConjointForm(form: FormGroup) {
    this.isRessourcesFinancieresConjointFormSubmitted = true;
    if(form.valid) {
      this.demandeurEmploiConnecteService.setRessourceFinanciereConjoint(this.conjoint);
      this.demandeurEmploiConnecteService.simulerMesAides();
    }
  }
}
