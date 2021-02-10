import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateDecomposee } from '@app/commun/models/date-decomposee';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';

@Component({
  selector: 'app-date-inputs',
  templateUrl: './date-inputs.component.html',
  styleUrls: ['./date-inputs.component.scss']
})
export class DateInputsComponent implements OnInit {


  @Input() dateSaisie: DateDecomposee;
  @Input() isFormSubmitted: boolean;

  @Output()dateChanged = new EventEmitter<void>();

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

  public onChangeOrKeyUpDateJour(): void {
    if (this.dateSaisie.jour && this.dateSaisie.jour.length === 2) {
      this.dateUtileService.checkFormatDate(this.dateSaisie);
      this.dateUtileService.checkDateAfterDateJour(this.dateSaisie);
      if(!this.dateSaisie.isJourInvalide) {
        this.moisDateInput.nativeElement.focus();
      }
    }
    this.dateChanged.emit();
  }

  public onChangeOrKeyUpDateMois(): void {
    if (this.dateSaisie.mois && this.dateSaisie.mois.length === 2) {
      this.dateUtileService.checkFormatDate(this.dateSaisie);
      this.dateUtileService.checkDateAfterDateJour(this.dateSaisie);
      if(!this.dateSaisie.isMoisInvalide) {
        this.anneeDateInput.nativeElement.focus();
      }
    }
    this.dateChanged.emit();
  }

  public onChangeOrKeyUpDateAnnee(): void {
    if(this.dateSaisie.annee  && this.dateSaisie.annee.length === 4) {
      this.dateUtileService.checkFormatDate(this.dateSaisie);
      this.dateUtileService.checkDateAfterDateJour(this.dateSaisie);
    }
    this.dateChanged.emit();
  }

  public onFocusOutDateJour(): void {
    this.dateUtileService.checkFormatJour(this.dateSaisie);
    if(this.dateSaisie.isJourInvalide) {
      this.jourDateInput.nativeElement.focus();
    }
  }

  public onFocusOutDateMois(): void {
    this.dateUtileService.checkFormatMois(this.dateSaisie);
    if(this.dateSaisie.isMoisInvalide) {
      this.moisDateInput.nativeElement.focus();
    }
  }

  public onFocusOutDateAnnee(): void {
    this.dateUtileService.checkFormatAnnee(this.dateSaisie);
    if(this.dateSaisie.isAnneeInvalide) {
      this.anneeDateInput.nativeElement.focus();
    }
  }

}
