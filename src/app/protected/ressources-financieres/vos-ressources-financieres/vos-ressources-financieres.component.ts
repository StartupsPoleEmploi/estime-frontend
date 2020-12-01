import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { DateDecomposee } from '@models/date-decomposee';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { DeConnecteInfosPersonnellesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-infos-personnelles.service";
import { DeConnecteBenefiaireAidesSocialesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-benefiaire-aides-sociales.service";


@Component({
  selector: 'app-vos-ressources-financieres',
  templateUrl: './vos-ressources-financieres.component.html',
  styleUrls: ['./vos-ressources-financieres.component.scss']
})
export class VosRessourcesFinancieresComponent implements OnInit {

  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  dateDernierOuvertureDroitASS: DateDecomposee;
  isRessourcesFinancieresFormSubmitted = false;

  @Input() ressourcesFinancieres: RessourcesFinancieres;
  @Output() validationVosRessourcesEventEmitter = new EventEmitter<void>();

  @ViewChild('anneeDateDerniereOuvertureDroitASS', { read: ElementRef }) anneeDateDerniereOuvertureDroitASSInput:ElementRef;
  @ViewChild('moisDateDerniereOuvertureDroitASS', { read: ElementRef }) moisDateDerniereOuvertureDroitASSInput:ElementRef;
  @ViewChild('vosRessourcesFinancieresForm', { read: NgForm }) vosRessourcesFinancieresForm:FormGroup;

  nombreMoisCumulAssSalaireSelectOptions = [
    { label: "1 mois", value: 1, default: true },
    { label: "2 mois", value: 2, default: false },
    { label: "3 mois", value: 3, default: false }
  ];

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteBenefiaireAidesSocialesService: DeConnecteBenefiaireAidesSocialesService,
    public deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService

  ) { }

  ngOnInit(): void {
    const test = this.ressourcesFinancieres;
    this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromStringDate(this.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS);
  }

  public onSubmitRessourcesFinancieresForm(form: FormGroup): void {
    this.isRessourcesFinancieresFormSubmitted = true;
    this.checkAndSaveDateDernierOuvertureDroitASS();
    if(form.valid) {
      this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieres);
      this.validationVosRessourcesEventEmitter.emit();
    }
  }

  public onClickRadioButtonHasCumuleAssEtSalaire(): void {
    if(this.ressourcesFinancieres.allocationsPoleEmploi.hasCumuleAssEtSalaire === false) {
      this.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesAssEtSalaire = 0;
    }
  }

  public handleKeyUpOnButtonHasCumuleAssEtSalaire(event: any, value: boolean) {
    if (event.keyCode === 13) {
      this.ressourcesFinancieres.allocationsPoleEmploi.hasCumuleAssEtSalaire = value;
      this.onClickRadioButtonHasCumuleAssEtSalaire();
    }
  }

  private checkAndSaveDateDernierOuvertureDroitASS(): void {
    this.dateDernierOuvertureDroitASS.messageErreurFormat = this.dateUtileService.checkFormat(this.dateDernierOuvertureDroitASS);
    if(this.dateUtileService.isDateDecomposeeSaisieValide(this.dateDernierOuvertureDroitASS)) {
      this.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS = this.dateUtileService.getStringDateFromDateDecomposee(this.dateDernierOuvertureDroitASS);
    }
  }

  /*** gestion évènement dateDernierOuvertureDroitASS */

  public onChangeOrKeyUpDateDerniereOuvertureDroitASSJour(event): void {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.jour;
    if(value && value.length === 2) {
      this.moisDateDerniereOuvertureDroitASSInput.nativeElement.focus();
    }
  }

  public onChangeOrKeyUpDateDerniereOuvertureDroitASSMois(event): void {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.mois;
    if(value && value.length === 2) {
      this.anneeDateDerniereOuvertureDroitASSInput.nativeElement.focus();
    }
  }

  public onFocusDateDerniereOuvertureDroitASS(): void {
    this.dateDernierOuvertureDroitASS.messageErreurFormat = undefined;
  }
}
