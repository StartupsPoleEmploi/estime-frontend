import { LocationStrategy } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AutresSituationsPersonneEnum } from '@app/commun/enumerations/autres-situations-personne.enum';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { AutresSituations } from '@app/commun/models/autres-situations';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-autres-situations',
  templateUrl: './autres-situations.component.html',
  styleUrls: ['./autres-situations.component.scss']
})
export class AutresSituationsComponent implements OnInit {


  //appel service http : gestion loading et erreur
  isPageLoadingDisplay = false;
  messageErreur: string;
  messageSucces: string;

  isFormSubmitted: boolean = false;

  autresSituationsPersonneEnum: typeof AutresSituationsPersonneEnum = AutresSituationsPersonneEnum;
  autresSituations: AutresSituations;

  @Input('modalRef') public modalRef: BsModalRef;
  @Input('atTag') public atTag: string;
  @Output() displayLoading = new EventEmitter<boolean>();

  constructor(
    private location: LocationStrategy,
    private modalService: ModalService,
    private deConnecteService: DeConnecteService,
    private estimeApiService: EstimeApiService,
    public controleChampFormulaireService: ControleChampFormulaireService,
  ) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      if (!this.modalService.isOpen) this.location.back();
    });
  }

  ngOnInit(): void {
    this.initAutresSituations();
  }

  private initAutresSituations(): void {
    this.autresSituations = new AutresSituations();
    this.autresSituations.salaire = false;
    this.autresSituations.alternant = false;
    this.autresSituations.formation = false;
    this.autresSituations.cej = false;
    this.autresSituations.ada = false;
    this.autresSituations.securisationProfessionnelle = false;
    this.autresSituations.travailleurIndependant = false;
    this.autresSituations.autre = false;
    this.autresSituations.autreContenu = '';
  }

  public onClickCheckBoxAutreSituationAutre(): void {
    if (!this.autresSituations.autre) {
      this.autresSituations.autreContenu = '';
    }
  }

  public handleKeyUpOnButtonAutreSituationAutre(event: any): void {
    event.preventDefault();
    this.onClickCheckBoxAutreSituationAutre();
  }

  public onSubmitAutresSituationsForm() {
    if (this.checkFormIsValid()) {
      this.displayLoading.emit(true);
      const demandeurEmploi = this.deConnecteService.getDemandeurEmploiConnecte();
      this.estimeApiService.creerAutresSituations(demandeurEmploi, this.autresSituations).subscribe({
        next: this.traiterRetourCreerAutresSituations.bind(this),
        error: this.traiterErreurCreerAutresSituations.bind(this)
      });
    }
  }

  public checkFormIsValid() {
    this.isFormSubmitted = true;
    let isValid = true;
    if (this.autresSituations != null) {
      if (this.autresSituations.autre) {
        isValid = this.autresSituations.autreContenu != '';
      }
    }
    return isValid;
  }

  private traiterRetourCreerAutresSituations() {
    this.displayLoading.emit(false);
    this.isFormSubmitted = false;
    this.messageSucces = "Votre situation a bien été enregistrée. Merci d'avoir contribué à l'évolution du service.";

  }

  private traiterErreurCreerAutresSituations() {
    this.displayLoading.emit(false);
    this.messageErreur = MessagesErreurEnum.ERREUR_ENREGISTREMENT_AUTRES_SITUATIONS;

  }
}
