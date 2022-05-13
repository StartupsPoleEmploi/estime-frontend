import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateDecomposee } from '@app/commun/models/date-decomposee';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';

@Component({
  selector: 'app-date-inputs',
  templateUrl: './date-inputs.component.html',
  styleUrls: ['./date-inputs.component.scss']
})
export class DateInputsComponent implements OnInit, AfterViewInit {

  @Input() autofocus: boolean;
  @Input() dateSaisie: DateDecomposee;
  @Input() isFormSubmitted: boolean;
  @Input() data_testid: string;

  @Output() dateChanged = new EventEmitter<void>();

  @ViewChild('jourDate', { read: ElementRef }) jourDateInput: ElementRef;
  @ViewChild('moisDate', { read: ElementRef }) moisDateInput: ElementRef;
  @ViewChild('anneeDate', { read: ElementRef }) anneeDateInput: ElementRef;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService
  ) { }

  ngOnInit(): void {

    this.dateUtileService.checkFormatDateAvecInferieurDateJour(this.dateSaisie);
  }

  ngAfterViewInit() {
    if (this.autofocus && !this.dateSaisie.jour) {
      this.jourDateInput.nativeElement.focus();
    }
  }

  public onChangeOrKeyUpDateJour(): void {
    if (this.dateSaisie.jour && this.dateSaisie.jour.length === 2) {
      this.dateUtileService.checkFormatDate(this.dateSaisie);
      this.dateUtileService.checkDateDecomposeAfterDateJour(this.dateSaisie);
      if (!this.dateSaisie.isJourInvalide) {
        this.moisDateInput.nativeElement.focus();
      }
    }
    this.dateChanged.emit();
  }

  public onChangeOrKeyUpDateMois(): void {
    if (this.dateSaisie.mois && this.dateSaisie.mois.length === 2) {
      this.dateUtileService.checkFormatDate(this.dateSaisie);
      this.dateUtileService.checkDateDecomposeAfterDateJour(this.dateSaisie);
      if (!this.dateSaisie.isMoisInvalide) {
        this.anneeDateInput.nativeElement.focus();
      }
    }
    this.dateChanged.emit();
  }

  public onChangeOrKeyUpDateAnnee(): void {
    if (this.dateSaisie.annee && this.dateSaisie.annee.length === 4) {
      this.dateUtileService.checkFormatDate(this.dateSaisie);
      this.dateUtileService.checkDateDecomposeAfterDateJour(this.dateSaisie);
    }
    this.dateChanged.emit();
  }

  public onFocusOutDateJour(): void {
    this.dateUtileService.checkFormatJour(this.dateSaisie);
    if (this.dateSaisie.isJourInvalide) {
      this.jourDateInput.nativeElement.focus();
    }
  }

  public onFocusOutDateMois(): void {
    this.dateUtileService.checkFormatMois(this.dateSaisie);
    if (this.dateSaisie.isMoisInvalide) {
      this.moisDateInput.nativeElement.focus();
    }
  }

  public onFocusOutDateAnnee(): void {
    this.dateUtileService.checkFormatAnnee(this.dateSaisie);
    if (this.dateSaisie.isAnneeInvalide) {
      this.anneeDateInput.nativeElement.focus();
    }
  }

  public getDataTestIdJour() {
    if (this.data_testid != null) {
      return `input-jour-date-${this.data_testid}`;
    }
    return 'input-jour-date';
  }

  public getDataTestIdMois() {
    if (this.data_testid != null) {
      return `input-mois-date-${this.data_testid}`;
    }
    return 'input-mois-date';
  }

  public getDataTestIdAnnee() {
    if (this.data_testid != null) {
      return `input-annee-date-${this.data_testid}`;
    }
    return 'input-annee-date';
  }

}
