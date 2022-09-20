import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CodesMessagesErreurEnum } from '@app/commun/enumerations/codes-messages-erreur.enum';
import { MessageErreur } from '@app/commun/models/message-erreur';
import { AuthorizationService } from '@app/core/services/connexion/authorization.service';
import { IndividuConnectedService } from "@app/core/services/connexion/individu-connected.service";
import { PeConnectService } from "@app/core/services/connexion/pe-connect.service";
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalChoixConnexionComponent } from './modal-choix-connexion/modal-choix-connexion.component';
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
  @ViewChild(ModalChoixConnexionComponent) modalChoixConnexionComponent;

  constructor(
    private authorizationService: AuthorizationService,
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
    const modalRef = this.bsModalService.show(ModalChoixConnexionComponent, this.config);
    modalRef.content.notifyParent.subscribe((result) => {
      console.error(result)
      this.checkDemandeurEmploiConnecte();
    })
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
      if (messageErreur?.code === CodesMessagesErreurEnum.POPULATION_NON_AUTORISEE) {
        this.bsModalService.show(ModalPopulationNonAutoriseeComponent, { class: 'modal-lg not-side-modal' });
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
