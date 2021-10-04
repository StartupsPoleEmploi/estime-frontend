import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { DeConnecteInfosPersonnellesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-infos-personnelles.service";
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { DeConnecteBenefiaireAidesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-benefiaire-aides.service";
import { NumeroProchainMoisDeclarationTrimestrielle } from "@models/numero-prochain-mois-declaration-trimestrielle";
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { SituationFamiliale } from '@models/situation-familiale';
import { SituationFamilialeUtileService } from '@app/core/services/utile/situation-familiale.service';

@Component({
  selector: 'app-ressources-financieres-foyer',
  templateUrl: './ressources-financieres-foyer.component.html',
  styleUrls: ['./ressources-financieres-foyer.component.scss']
})
export class RessourcesFinancieresFoyerComponent implements OnInit {

  isRessourcesFinancieresFoyerFormSubmitted = false;

  @ViewChild('ressourcesFinancieresFoyerForm', { read: NgForm }) ressourcesFinancieresFoyerForm: FormGroup;
  @ViewChild('popoverRevenusImmobiliers') popoverRevenusImmobiliers: PopoverDirective;
  @ViewChild('popoverSituationLogement') popoverSituationLogement: PopoverDirective;

  @Input() ressourcesFinancieres: RessourcesFinancieres;

  @Output() validationRessourcesFoyerEventEmitter = new EventEmitter<void>();

  optionsProchaineDeclarationTrimestrielle: Array<NumeroProchainMoisDeclarationTrimestrielle>;

  informationsPersonnelles: InformationsPersonnelles;
  beneficiaireAides: BeneficiaireAides;
  situationFamiliale: SituationFamiliale;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public deConnecteService: DeConnecteService,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    public deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    public deConnecteBeneficiaireAidesService: DeConnecteBenefiaireAidesService,
    public dateUtileService: DateUtileService,
    public screenService: ScreenService,
    public deConnecteBenefiaireAidesService: DeConnecteBenefiaireAidesService,
    private elementRef: ElementRef,
    private situationFamilialeUtileService: SituationFamilialeUtileService
  ) {

  }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (this.deConnecteBenefiaireAidesService.hasFoyerRSA()) {
      this.initOptionsProchaineDeclarationTrimestrielle();
    }
    this.loadDataSituationFamiliale(demandeurEmploiConnecte);
    this.informationsPersonnelles = demandeurEmploiConnecte.informationsPersonnelles;
  }

  public onSubmitRessourcesFinancieresFoyerForm(form: FormGroup): void {
    this.isRessourcesFinancieresFoyerFormSubmitted = true;
    if (form.valid) {
      this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieres);
      this.validationRessourcesFoyerEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  public onClickPopoverRevenusImmobiliers(event) {
    event.stopPropagation();
  }

  public onClickClosePopoverRevenusImmobiliers(event) {
    event.stopPropagation();
    this.popoverRevenusImmobiliers.hide();
  }

  public onClickPopoverSituationLogement(event) {
    event.stopPropagation();
  }

  public onClickClosePopoverSituationLogement(event): void {
    event.stopPropagation();
    this.popoverSituationLogement.hide();
  }

  private initOptionsProchaineDeclarationTrimestrielle() {
    this.optionsProchaineDeclarationTrimestrielle = new Array<NumeroProchainMoisDeclarationTrimestrielle>();
    for (let i = 0; i < 4; i++) {
      const numeroProchainMoisDeclarationTrimesNumeroProchainMoisDeclarationTrimestrielle = new NumeroProchainMoisDeclarationTrimestrielle();
      numeroProchainMoisDeclarationTrimesNumeroProchainMoisDeclarationTrimestrielle.value = i;
      numeroProchainMoisDeclarationTrimesNumeroProchainMoisDeclarationTrimestrielle.label = this.dateUtileService.getLibelleMoisApresDateJour(i);
      this.optionsProchaineDeclarationTrimestrielle.push(numeroProchainMoisDeclarationTrimesNumeroProchainMoisDeclarationTrimestrielle);
    }
  }

  private loadDataSituationFamiliale(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.situationFamiliale) {
      this.situationFamiliale = demandeurEmploiConnecte.situationFamiliale;
    } else {
      this.situationFamiliale = this.situationFamilialeUtileService.creerSituationFamiliale();
    }
  }

  public handleKeyUpOnButtonProprietaireSansPretOuLogeGratuit(event: any, value: boolean): void {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.isProprietaireSansPretOuLogeGratuit = value;
    }
  }

}
