import { Component, OnInit } from '@angular/core';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { Subscription } from 'rxjs';
import { MessagesErreurEnum } from "@enumerations/messages-erreur.enum";

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.scss']
})
export class CguComponent implements OnInit {

  isLoggedIn = false
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  messageInfoSuppressionDonneesPerso: string;
  isErreurMessageInfoSuppression = false;
  subscriptionStatutIndividuChangedObservable: Subscription;

  constructor(
    private estimeApiService: EstimeApiService,
    private individuConnectedService: IndividuConnectedService
  ) {
    this.subscribeStatutIndividuChangedObservable();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.individuConnectedService.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.subscriptionStatutIndividuChangedObservable.unsubscribe();
  }

  public onClickBoutonSupprimerDonneesPerso(): void {
    const individuConnected = this.individuConnectedService.getIndividuConnected();
    this.isErreurMessageInfoSuppression = false;
    this.estimeApiService.supprimerDonneesSuiviParcoursDemandeur(individuConnected.idPoleEmploi).then(
      (retour) => {
        this.messageInfoSuppressionDonneesPerso = 'Vos données personnelles ont bien été supprimées !';
      }, (erreur) => {
        this.isErreurMessageInfoSuppression = true;
        this.messageInfoSuppressionDonneesPerso = MessagesErreurEnum.SUPPRESSION_DONNEES_PERSO_IMPOSSIBLE;
      }
    );;
  }

  private subscribeStatutIndividuChangedObservable(): void {
    this.subscriptionStatutIndividuChangedObservable = this.individuConnectedService.statutIndividuChanged.subscribe(loggedIn =>  {
      this.isLoggedIn = loggedIn;
    });
  }

}
