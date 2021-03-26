import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '@app/core/services/connexion/authorization.service';
import { IndividuConnectedService } from "@app/core/services/connexion/individu-connected.service";
import { PeConnectService } from "@app/core/services/connexion/pe-connect.service";
import { ScreenService } from '@app/core/services/utile/screen.service';
import { CodesMessagesErreurEnum } from "@enumerations/codes-messages-erreur.enum";
import { NiveauMessagesErreurEnum } from "@enumerations/niveaux-message-erreur";
import { RoutesEnum } from '@enumerations/routes.enum';
import { MessageErreur } from '@models/message-erreur';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  messageErreur: MessageErreur;
  niveauMessageErreur = 'danger';
  toto: string;

  @ViewChild('messageErreurElement', {static: true}) messageErreurElement;

  constructor(
    private authorizationService: AuthorizationService,
    public individuConnectedService: IndividuConnectedService,
    public peConnectService: PeConnectService,
    private router: Router,
    public screenService: ScreenService
  ) {
  }

  ngOnInit(): void {
    this.checkDemandeurEmploiConnecte();
  }

  public login(): void {
    this.peConnectService.login();
  }

  public onClickButtonJeCommence(): void {
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }

  public getLibelleBoutonPeConnect(): string {
    let libelle = 'Se connecter avec pôle emploi';
    if (this.individuConnectedService.isLoggedIn() || this.peConnectService.isDemandeurPEConnecte()) {
      libelle = 'Commencer ma simulation';
    }
    return libelle;
  }

  private checkDemandeurEmploiConnecte(): void {
    this.messageErreur = this.authorizationService.getMessageErreur();
    if (this.messageErreur) {
      if (this.messageErreur.code && this.messageErreur.code === CodesMessagesErreurEnum.INDIVIDU_NON_BENEFICIAIRE_MINIMA_SOCIAUX) {
        this.niveauMessageErreur = NiveauMessagesErreurEnum.INFO;
        this.peConnectService.logout();
      } else {
        this.niveauMessageErreur = NiveauMessagesErreurEnum.ERROR;
      }
      this.messageErreurElement.nativeElement.focus();
    }
  }
}
