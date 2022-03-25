import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-pas-de-compte',
  templateUrl: './modal-pas-de-compte.component.html',
  styleUrls: ['./modal-pas-de-compte.component.scss']
})
export class ModalPasDeCompteComponent implements OnInit {

  model = {
    email: ''
  }

  isEmailFormSubmitted: boolean = false;
  isRetourApiKO: boolean = false;
  isRetourApiOK: boolean = false;
  messageErreur = '';

  constructor(
    public bsModalRef: BsModalRef,
    public controleChampFormulaireService: ControleChampFormulaireService,
    private estimeApiService: EstimeApiService
  ) { }

  ngOnInit(): void {
  }

  public onClickButtonClosePopup(): void {
    this.bsModalRef.hide();
  }

  public onSubmitEmailForm(form: FormGroup): void {
    this.isEmailFormSubmitted = true;
    if (form.valid) {
      this.estimeApiService.creerEmail(this.model.email).subscribe({
        complete: this.traiterCreationEmail.bind(this),
        error: this.traiterErreurCreationEmail.bind(this)
      });
    }
  }

  private traiterCreationEmail(): void {
    this.isRetourApiOK = true;
    this.isRetourApiKO = false;
  }

  private traiterErreurCreationEmail(error: HttpErrorResponse): void {
    this.isRetourApiKO = true;
    this.isRetourApiOK = false;
    this.messageErreur = error.error.message;
  }
}
