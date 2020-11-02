import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Personne } from '@models/personne';
import { RessourcesFinancieres } from '@models/ressources-financieres';

@Component({
  selector: 'app-mes-informations-identite',
  templateUrl: './mes-informations-identite.component.html',
  styleUrls: ['./mes-informations-identite.component.scss']
})
export class MesInformationsIdentiteComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  nationaliteSelectOptions = [
    { label: "française"},
    { label: "ressortissant européen ou suisse"},
    { label: "autre"}
  ];

  constructor(
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
  }

  redirectVersPagePrecedente() {
    this.router.navigate([RoutesEnum.MON_FUTUR_DE_TRAVAIL], { replaceUrl: true });
  }

  redirectVersPageSuivante() {
    console.log(this.demandeurEmploiConnecte);
    this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    this.router.navigate([RoutesEnum.MA_SITUATION_FAMILIALE], { replaceUrl: true });
  }

  setTitreSejourEnFranceValide(nationalite: string) {
    if(nationalite !== 'autre') {
      this.demandeurEmploiConnecte.informationsIdentite.titreSejourEnFranceValide = null;
    } else {
      this.demandeurEmploiConnecte.informationsIdentite.titreSejourEnFranceValide = true;
    }
  }

  setDemandeurEmploiConjoint() {
    if(this.demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      const conjoint = new Personne();
      conjoint.ressourcesFinancieres = new RessourcesFinancieres();
      this.demandeurEmploiConnecte.situationFamiliale.conjoint = conjoint;
    } else {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint = null;
    }
  }
}
