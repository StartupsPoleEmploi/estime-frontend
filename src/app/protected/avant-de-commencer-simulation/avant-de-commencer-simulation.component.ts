import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { PageTitlesEnum } from "@enumerations/page-titles.enum";
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-avant-de-commencer-simulation',
  templateUrl: './avant-de-commencer-simulation.component.html',
  styleUrls: ['./avant-de-commencer-simulation.component.scss']
})
export class AvantDeCommencerSimulationComponent implements OnInit {

  isPageLoadingDisplay = false;
  isSmallScreen: boolean;
  messageErreur: string;

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  constructor(
    private deConnecteService: DeConnecteService,
    private estimeApiService: EstimeApiService,
    private router: Router,
    private screenService: ScreenService
    ) { }

  ngOnInit(): void {
    this.isSmallScreen = this.screenService.isSmallScreen();
  }

  public getTextPieceAttestationPE(): string {
    let textPieceAttestationPE = "dernière notification ASS Pôle Emploi";
    if(this.isSmallScreen) {
      textPieceAttestationPE = "dernière notification \nASS Pôle Emploi";
    }
    return textPieceAttestationPE;
  }

  public onClickButtonJeContinue(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(!demandeurEmploiConnecte) {
      this.isPageLoadingDisplay = true;
      this.estimeApiService.creerDemandeurEmploi().then(
        (demandeurEmploi) => {
          this.deConnecteService.setDemandeurEmploiConnecte(demandeurEmploi);
          this.isPageLoadingDisplay = false;
          this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.CONTRAT_TRAVAIL]);
        }, (erreur) => {
          this.isPageLoadingDisplay = false;
          console.log(erreur);
          this.messageErreur = MessagesErreurEnum.ERREUR_SERVICE;
        }
      );
    } else {
      this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.CONTRAT_TRAVAIL]);
    }
  }



}
