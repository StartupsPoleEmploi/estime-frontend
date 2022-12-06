import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { MessageErreur } from '@app/commun/models/message-erreur';
import { AuthorizationService } from '@app/core/services/connexion/authorization.service';
import { IndividuConnectedService } from "@app/core/services/connexion/individu-connected.service";
import { PeConnectService } from "@app/core/services/connexion/pe-connect.service";
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalChoixConnexionComponent } from './modal-choix-connexion/modal-choix-connexion.component';

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
  @ViewChild(ModalChoixConnexionComponent) modalChoixConnexionComponent;

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    public bsModalService: BsModalService,
    public modalService: ModalService,
    public individuConnectedService: IndividuConnectedService,
    public peConnectService: PeConnectService,
    public screenService: ScreenService
  ) {
  }

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'gray half-top full-height-modal not-side-modal'
  };

  ngOnInit(): void {
    this.checkDemandeurEmploiConnecte();
    this.scrollPositionOffset = document.getElementById('image-homepage-calculette').offsetTop;

  }

  public openModalOnEventChoixConnexion() {
    if (this.individuConnectedService.isLoggedIn()) this.router.navigate([RoutesEnum.CHOIX_TYPE_SIMULATION]);
    else {
      const modalRef = this.bsModalService.show(ModalChoixConnexionComponent, this.config);
      modalRef.content.notifyParent.subscribe((result) => {
        console.error(result);
        this.checkDemandeurEmploiConnecte();
      });
    }
  }

  public login(): void {
    this.peConnectService.login();
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
      this.messageErreur = messageErreur;
      if (this.messageErreur) {
        this.messageErreurElement.nativeElement.focus();
      }
    }
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.stickyButton = this.screenService.isExtraSmallScreen() && this.screenService.isButtonSticky(scrollPosition, this.scrollPositionOffset);
  }
}
