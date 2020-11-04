import { Component, OnInit, ElementRef } from '@angular/core';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Personne } from '@app/commun/models/personne';
import { FormGroup } from '@angular/forms';
import { InformationsIdentite } from '@app/commun/models/informations-identite';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';

@Component({
  selector: 'app-ma-situation-familiale',
  templateUrl: './ma-situation-familiale.component.html',
  styleUrls: ['./ma-situation-familiale.component.scss']
})
export class MaSituationFamilialeComponent implements OnInit {

  submitted = false;
  demandeurEmploiConnecte: DemandeurEmploi;
  moisSelectOptions  = [
    { value: "01" },
    { value: "02" },
    { value: "03" },
    { value: "04" },
    { value: "05" },
    { value: "06" },
    { value: "07" },
    { value: "08" },
    { value: "09" },
    { value: "10" },
    { value: "11" },
    { value: "12" }
  ];

  constructor(
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
  }

  redirectVersPagePrecedente() {
    this.router.navigate([RoutesEnum.MES_INFORMATIONS_IDENTITE], { replaceUrl: true });
  }

  redirectVersPageSuivante(form: FormGroup): void {
    this.submitted = true;
    if(form.valid) {
      this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      if(this.demandeurEmploiConnecte.situationFamiliale.nombrePersonnesACharge > 0) {
        this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
      } else {
        this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
      }
    }
  }

  removePersonneACharge(): void {
    this.demandeurEmploiConnecte.situationFamiliale.nombrePersonnesACharge = this.demandeurEmploiConnecte.situationFamiliale.nombrePersonnesACharge - 1;
    this.demandeurEmploiConnecte.situationFamiliale.personnesACharge.pop();
  }

  addPersonneACharge(): void {
    this.demandeurEmploiConnecte.situationFamiliale.nombrePersonnesACharge = this.demandeurEmploiConnecte.situationFamiliale.nombrePersonnesACharge + 1;
    if(!this.demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      this.demandeurEmploiConnecte.situationFamiliale.personnesACharge = new Array<Personne>();
    }
    const personne = new Personne();
    personne.informationsIdentite = new InformationsIdentite();
    this.demandeurEmploiConnecte.situationFamiliale.personnesACharge.push(personne);
    console.log(this.demandeurEmploiConnecte);
  }
}
