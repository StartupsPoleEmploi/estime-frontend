import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CodesMessagesErreurEnum } from '@app/commun/enumerations/codes-messages-erreur.enum';
import { MessageErreur } from '@app/commun/models/message-erreur';
import { AuthorizationService } from '@app/core/services/connexion/authorization.service';
import { IndividuConnectedService } from "@app/core/services/connexion/individu-connected.service";
import { PeConnectService } from "@app/core/services/connexion/pe-connect.service";
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalPasDeCompteComponent } from './modal-pas-de-compte/modal-pas-de-compte.component';
import { ModalPopulationNonAutoriseeComponent } from './modal-population-non-autorisee/modal-population-non-autorisee.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  messageErreur: MessageErreur;
  stickyButton = false;
  scrollPositionOffset: number;

  @ViewChild('messageErreurElement', { static: true }) messageErreurElement;

  constructor(
    private authorizationService: AuthorizationService,
    private bsModalService: BsModalService,
    public modalService: ModalService,
    public individuConnectedService: IndividuConnectedService,
    public peConnectService: PeConnectService,
    private router: Router,
    public screenService: ScreenService
  ) {
  }

  ngOnInit(): void {
    this.checkDemandeurEmploiConnecte();
    this.scrollPositionOffset = document.getElementById('image-homepage-calculette').offsetTop;
  }

  public login(): void {
    this.peConnectService.login();
  }

  public onClickButtonJeCommence(): void {
    if (this.individuConnectedService.isLoggedIn()) this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
    else this.login();
  }

  public onClickPasDeCompte(): void {
    this.bsModalService.show(ModalPasDeCompteComponent, { class: 'modal-lg full-height-modal' });
  }

  public getLibelleBoutonPeConnect(): string {
    let libelle = 'Se connecter avec pôle emploi';
    if (this.individuConnectedService.isLoggedIn()) {
      libelle = 'Commencer ma simulation';
    }
    return libelle;
  }

  private checkDemandeurEmploiConnecte(): void {
    const messageErreur = this.authorizationService.getMessageErreur();
    if (messageErreur) {
      if (messageErreur?.code === CodesMessagesErreurEnum.POPULATION_NON_AUTORISEE) {
        this.bsModalService.show(ModalPopulationNonAutoriseeComponent, { class: 'modal-lg' });
      } else {
        this.messageErreur = messageErreur;
        if (this.messageErreur) {
          this.messageErreurElement.nativeElement.focus();
        }
      }
    }
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.stickyButton = this.screenService.isExtraSmallScreen() && this.screenService.isButtonSticky(scrollPosition, this.scrollPositionOffset);
  }
}
