import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { PageHeadlineEnum } from '@app/commun/enumerations/page-headline.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { TypeContratTravailEnum } from '@app/commun/enumerations/enumerations-formulaire/type-contrat-travail.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { FuturTravail } from '@app/commun/models/futur-travail';
import { Salaire } from '@app/commun/models/salaire';
import { Simulation } from '@app/commun/models/simulation';
import { DeConnecteSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-simulation.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { SalaireService } from '@app/core/services/utile/salaire.service';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-activite-reprise',
  templateUrl: './activite-reprise.component.html',
  styleUrls: ['./activite-reprise.component.scss']
})
export class ActiviteRepriseComponent implements OnInit {

  PageHeadlineEnum: typeof PageHeadlineEnum = PageHeadlineEnum;

  @Input() isModificationCriteres: boolean;
  @ViewChild('activiteRepriseForm', { read: NgForm }) activiteRepriseForm: UntypedFormGroup;

  isActiviteRepriseFormSubmitted: boolean = false;

  demandeurEmploiConnecte: DemandeurEmploi;
  futurTravail: FuturTravail;
  isPageLoadingDisplay: boolean = false;
  messageErreur: string;
  typeSalaireDisplay: string;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public screenService: ScreenService,
    public deConnecteService: DeConnecteService,
    public salaireService: SalaireService,
    private deConnecteSimulationService: DeConnecteSimulationService,
    private estimeApiService: EstimeApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.initFuturTravail();
    this.typeSalaireDisplay = 'mensuel_brut';
  }


  private initFuturTravail(): void {
    if (this.demandeurEmploiConnecte.futurTravail == null) {
      this.futurTravail = new FuturTravail();
      this.futurTravail.salaire = new Salaire();
      this.futurTravail.salaire.montantMensuelBrut = null;
      this.futurTravail.salaire.montantMensuelNet = null;
      this.futurTravail.salaire.montantHoraireBrut = null;
      this.futurTravail.salaire.montantHoraireNet = null;
      this.futurTravail.nombreHeuresTravailleesSemaine = 35;
      this.futurTravail.distanceKmDomicileTravail = 0;
      this.futurTravail.nombreTrajetsDomicileTravail = 0;
      this.futurTravail.typeContrat = TypeContratTravailEnum.CDI;
    } else {
      this.futurTravail = this.demandeurEmploiConnecte.futurTravail;
    }
  }

  public propagateSalaireHoraireMensuel() {
    if (this.futurTravail.salaire.montantHoraireNet != null || this.futurTravail.salaire.montantHoraireBrut != null || this.futurTravail.salaire.montantMensuelNet != null || this.futurTravail.salaire.montantMensuelBrut != null) {
      switch (this.typeSalaireDisplay) {
        case "mensuel_net":
          this.salaireService.calculSalaireFromMensuelNet(this.futurTravail);
          break;
        case "mensuel_brut":
          this.salaireService.calculSalaireFromMensuelBrut(this.futurTravail);
          break;
        case "horaire_net":
          this.salaireService.calculSalaireFromHoraireNet(this.futurTravail);
          break;
        case "horaire_brut":
          this.salaireService.calculSalaireFromHoraireBrut(this.futurTravail);
          break;
      }
    } else {
      this.futurTravail.salaire.montantHoraireBrut = undefined;
      this.futurTravail.salaire.montantHoraireNet = undefined;
      this.futurTravail.salaire.montantMensuelBrut = undefined;
      this.futurTravail.salaire.montantMensuelNet = undefined;
    }
    this.isActiviteRepriseFormSubmitted = false;
  }

  public getMontantSmicMensuelNet() {
    return this.salaireService.getSmicMensuelNetFromNombreHeure(this.futurTravail.nombreHeuresTravailleesSemaine)
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.PARCOURS_COMPLEMENT_ARE, RoutesEnum.SITUATION]);
  }

  public onSubmitActiviteRepriseForm(): void {
    this.isActiviteRepriseFormSubmitted = true;
    if (this.isDonneesSaisiesFormulaireValides()) {
      this.checkAndSaveDemandeurEmploiConnecte();
      if (!this.isModificationCriteres) this.router.navigate([RoutesEnum.PARCOURS_COMPLEMENT_ARE, RoutesEnum.ACTIVITE_REPRISE]);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }

  }

  private checkAndSaveDemandeurEmploiConnecte(): void {
    this.deConnecteService.setFuturTravail(this.futurTravail);
  }

  public onClickButtonObtenirSimulation(): void {
    this.isActiviteRepriseFormSubmitted = true;
    if (this.isDonneesSaisiesFormulaireValides()) {
      this.isPageLoadingDisplay = true;
      this.checkAndSaveDemandeurEmploiConnecte();
      const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
      this.estimeApiService.simulerComplementARE(demandeurEmploiConnecte).subscribe({
        next: this.traiterRetourSimulerMesAides.bind(this),
        error: this.traiterErreurSimulerMesAides.bind(this)
      });
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  private isDonneesSaisiesFormulaireValides(): boolean {
    return this.activiteRepriseForm.valid
      && this.futurTravail.salaire.montantMensuelBrut > 0
      && this.futurTravail.salaire.montantMensuelNet > 0;
  }

  private traiterRetourSimulerMesAides(simulation: Simulation): void {
    this.deConnecteSimulationService.setSimulation(simulation);
    this.isPageLoadingDisplay = false;
    this.router.navigate([RoutesEnum.PARCOURS_COMPLEMENT_ARE, RoutesEnum.RESULTAT_SIMULATION]);
  }

  private traiterErreurSimulerMesAides(): void {
    this.isPageLoadingDisplay = false;
    this.messageErreur = MessagesErreurEnum.SIMULATION_IMPOSSIBLE;
  }

  public isChampFuturSalaireInvalide(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet) {
    return this.isChampFuturSalaireNonPresent(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet)
      || this.isChampFuturSalaireEgalAZero(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet)
      || this.isChampFuturSalaireErreurMontant(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet);
  }

  public isChampFuturSalaireNonPresent(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet): boolean {
    return ((this.isActiviteRepriseFormSubmitted ||
      (
        salaireMensuelBrut?.touched
        || salaireHoraireBrut?.touched
        || salaireMensuelNet?.touched
        || salaireHoraireNet?.touched
      )) && (
        this.futurTravail.salaire.montantMensuelBrut == null
        || this.futurTravail.salaire.montantHoraireBrut == null
        || this.futurTravail.salaire.montantMensuelNet == null
        || this.futurTravail.salaire.montantHoraireNet == null
      )
    );
  }

  public isChampFuturSalaireEgalAZero(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet): boolean {
    return ((this.isActiviteRepriseFormSubmitted || salaireMensuelBrut?.touched) && this.futurTravail.salaire.montantMensuelBrut != null && this.futurTravail.salaire.montantMensuelBrut <= 0)
      || ((this.isActiviteRepriseFormSubmitted || salaireMensuelNet?.touched) && this.futurTravail.salaire.montantMensuelNet != null && this.futurTravail.salaire.montantMensuelNet <= 0)
      || ((this.isActiviteRepriseFormSubmitted || salaireHoraireBrut?.touched) && this.futurTravail.salaire.montantHoraireBrut != null && this.futurTravail.salaire.montantHoraireBrut <= 0)
      || ((this.isActiviteRepriseFormSubmitted || salaireHoraireNet?.touched) && this.futurTravail.salaire.montantHoraireNet != null && this.futurTravail.salaire.montantHoraireNet <= 0)
  }

  public isChampFuturSalaireErreurMontant(salaireHoraireBrut, salaireHoraireNet, salaireMensuelBrut, salaireMensuelNet): boolean {
    return ((this.isActiviteRepriseFormSubmitted || salaireMensuelBrut?.touched) && salaireMensuelBrut?.errors?.pattern)
      || ((this.isActiviteRepriseFormSubmitted || salaireMensuelNet?.touched) && salaireMensuelNet?.errors?.pattern)
      || ((this.isActiviteRepriseFormSubmitted || salaireHoraireBrut?.touched) && salaireHoraireBrut?.errors?.pattern)
      || ((this.isActiviteRepriseFormSubmitted || salaireHoraireNet?.touched) && salaireHoraireNet?.errors?.pattern);
  }
}
