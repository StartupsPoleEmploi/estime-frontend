import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { LiensUtilesEnum } from '@app/commun/enumerations/liens-utiles.enum';
import { DetailMensuel } from '@app/commun/models/detail-mensuel';
import { RessourceFinanciere } from '@app/commun/models/ressource-financiere';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { DeConnecteSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-simulation.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { RedirectionExterneService } from '@app/core/services/utile/redirection-externe.service';
import { RessourcesFinancieresService } from '@app/core/services/utile/ressources-financieres.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { SideModalService } from '@app/core/services/utile/side-modal.service';
import { SimulationService } from '@app/core/services/utile/simulation.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-detail-mois-apres-simulation',
  templateUrl: './detail-mois-apres-simulation.component.html',
  styleUrls: ['./detail-mois-apres-simulation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailMoisApresSimulationComponent implements OnInit {

  @Input() simulationActuelle: SimulationMensuelle;
  @Input() detailMensuel: DetailMensuel;
  @Input() modalRef: BsModalRef;

  ressourcesFinancieresEtAidesMois: RessourceFinanciere[];
  ressourceFinanciereOuAideSelected: RessourceFinanciere;
  titrePointEssentielLabel: string;

  constructor(
    private location: LocationStrategy,
    private redirectionExterneService: RedirectionExterneService,
    public ressourcesFinancieresService: RessourcesFinancieresService,
    public dateUtileService: DateUtileService,
    public deConnecteSimulationService: DeConnecteSimulationService,
    public simulationService: SimulationService,
    public screenService: ScreenService,
    public sideModalService: SideModalService) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      if (typeof this.ressourceFinanciereOuAideSelected == undefined) {
        this.sideModalService.closeSideModalMois();
      }
    });
  }

  ngOnInit(): void {
    this.ressourcesFinancieresEtAidesMois = this.simulationService.getRessourcesFinancieresEtAidesSimulationMensuelle(this.simulationActuelle);
    this.orderRessourcesFinancieresMois();
    this.titrePointEssentielLabel = this.detailMensuel.details.length == 1 ? "Point essentiel" : "Points essentiels";
  }

  private orderRessourcesFinancieresMois() {
    this.ressourcesFinancieresEtAidesMois.sort((a, b) => b.montant - a.montant);
  }

  public onClickOnEnSavoirPlus(aide): void {
    if (this.ressourcesFinancieresService.isRessourceFinanciereOuAideAvecDescription(aide)) {
      switch (aide.code) {
        case CodesAidesEnum.AGEPI:
          this.redirectionExterneService.navigate(LiensUtilesEnum.DESCRIPTION_AGEPI);
          break;
        case CodesAidesEnum.AIDE_MOBILITE:
          this.redirectionExterneService.navigate(LiensUtilesEnum.DESCRIPTION_AIDE_MOBILITE);
          break;
        case CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE:
          this.redirectionExterneService.navigate(LiensUtilesEnum.DESCRIPTION_ASS);
          break;
        case CodesAidesEnum.PRIME_ACTIVITE:
          this.redirectionExterneService.navigate(LiensUtilesEnum.DESCRIPTION_PRIME_ACTIVITE);
          break;
        case CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT:
        case CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE:
        case CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE:
          this.redirectionExterneService.navigate(LiensUtilesEnum.DESCRIPTION_AIDES_LOGEMENT);
          break;
      }
    }
  }

  public handleKeyUpOnEnSavoirPlus(event: any, ressourceFinanciereOuAide: RessourceFinanciere) {
    if (event.keyCode === 13) {
      this.onClickOnEnSavoirPlus(ressourceFinanciereOuAide);
    }
  }

  public onClickOnFaireLaDemande(aide): void {
    if (this.ressourcesFinancieresService.isRessourceFinanciereOuAideADemander(aide)) {
      switch (aide.code) {
        case CodesAidesEnum.AGEPI:
        case CodesAidesEnum.AIDE_MOBILITE:
          this.redirectionExterneService.navigate(LiensUtilesEnum.DEMANDE_AGEPI_AIDE_MOBILITE);
          break;
        case CodesAidesEnum.PRIME_ACTIVITE:
          this.redirectionExterneService.navigate(LiensUtilesEnum.DEMANDE_AIDES_LOGEMENT);
          break;
        case CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT:
        case CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE:
        case CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE:
          this.redirectionExterneService.navigate(LiensUtilesEnum.DEMANDE_PRIME_ACTIVITE);
          break;
      }
    }
  }

  public handleKeyUpOnFaireLaDemande(event: any, ressourceFinanciereOuAide: RessourceFinanciere) {
    if (event.keyCode === 13) {
      this.onClickOnFaireLaDemande(ressourceFinanciereOuAide);
    }
  }

  public handleKeyUpOnRetour(event: any) {
    if (event.keyCode === 13) {
      this.sideModalService.closeSideModalMois()
    }
  }
}
