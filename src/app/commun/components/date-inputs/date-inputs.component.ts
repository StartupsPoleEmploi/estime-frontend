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
    const value = this.dateSaisie.jour;
    if (value && value.length === 2) {
      this.dateUtileService.checkFormatJour(this.dateSaisie);
      this.dateUtileService.checkDateAfterDateJour(this.dateSaisie);
      if(!this.dateSaisie.isJourInvalide) {
        this.moisDateInput.nativeElement.focus();
      }
    }
    this.dateChanged.emit();
  }

  public onChangeOrKeyUpDateMois(): void {
    const value = this.dateSaisie.mois;
    if (value && value.length === 2) {
      this.dateUtileService.checkFormatMois(this.dateSaisie);
      this.dateUtileService.checkDateAfterDateJour(this.dateSaisie);
      if(!this.dateSaisie.isMoisInvalide) {
        this.anneeDateInput.nativeElement.focus();
      }
    }
    this.dateChanged.emit();
  }

  public onChangeOrKeyUpDateAnnee(): void {
    this.dateUtileService.checkFormatAnnee(this.dateSaisie);
    this.dateUtileService.checkDateAfterDateJour(this.dateSaisie);
    this.dateChanged.emit();
  }

}
