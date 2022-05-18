import { LocationStrategy } from '@angular/common';
import { Component, OnInit, Input, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { TypesContratTavailEnum } from '@app/commun/enumerations/types-contrat-travail.enum';
import { FuturTravail } from '@app/commun/models/futur-travail';
import { Salaire } from '@app/commun/models/salaire';
import { Simulation } from '@app/commun/models/simulation';
import { DeConnecteSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-simulation.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { AidesService } from '@app/core/services/utile/aides.service';
import { BrutNetService } from '@app/core/services/utile/brut-net.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { SideModalService } from '@app/core/services/utile/side-modal.service';
import { ContactComponent } from '@app/public/contact/contact.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ContratTravailComponent } from '../../1.contrat-travail/contrat-travail.component';

@Component({
  selector: 'app-modification-criteres',
  templateUrl: './modification-criteres.component.html',
  styleUrls: ['./modification-criteres.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModificationCriteresComponent implements OnInit {

  @Input() modalRef: BsModalRef;
  @Output() displayLoading = new EventEmitter<boolean>();
  @ViewChild('contratTravailComponent', { read: ContratTravailComponent }) contratTravailComponent: ContratTravailComponent;

  isPageLoadingDisplay: boolean;
  messageErreur: string;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private deConnecteService: DeConnecteService,
    private deConnecteSimulationService: DeConnecteSimulationService,
    private estimeApiService: EstimeApiService,
    private location: LocationStrategy,
    public modalService: ModalService,
    private router: Router,
    public screenService: ScreenService,
    public sideModalService: SideModalService
  ) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      this.sideModalService.closeSideModalModificationCriteres();
    });
  }

  ngOnInit(): void { }

  public handleKeyUpOnRetour(event: any) {
    if (event.keyCode === 13) {
      this.sideModalService.closeSideModalModificationCriteres()
    }
  }

  public onClickButtonModificationAutresCriteres(): void {
    this.sideModalService.closeSideModalModificationCriteres();
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.MA_SITUATION]);
  }

  public onSubmitModificationCriteresForm(): void {
    this.contratTravailComponent.onSubmitFuturTravailForm();
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.displayLoading.emit(true);
    this.estimeApiService.simulerMesAides(demandeurEmploiConnecte).subscribe({
      next: this.traiterRetourSimulerMesAides.bind(this),
      error: this.traiterErreurSimulerMesAides.bind(this)
    });
  }

  private traiterRetourSimulerMesAides(simulation: Simulation): void {
    this.sideModalService.closeSideModalModificationCriteres();
    this.deConnecteSimulationService.setSimulation(simulation);
    this.displayLoading.emit(false);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.RESULTAT_SIMULATION]));
  }

  private traiterErreurSimulerMesAides(): void {
    this.displayLoading.emit(false);
    this.messageErreur = MessagesErreurEnum.SIMULATION_IMPOSSIBLE;
  }
}
