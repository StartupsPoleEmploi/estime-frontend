import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Personne } from '@models/personne';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { FormGroup, FormControl } from '@angular/forms';
import { NumberUtileService } from '@app/core/services/utile/number-util.service';
import { DateDecomposee } from "@models/date-decomposee";
import { DateUtileService } from "@app/core/services/utile/date-util.service";
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-mes-informations-identite',
  templateUrl: './mes-informations-identite.component.html',
  styleUrls: ['./mes-informations-identite.component.scss']
})
export class MesInformationsIdentiteComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  submitted = false;
  moisSelectOptions  = [
    { value: "01" },
    { value: "02" },
    { value: "03" },
    { value: "04" },
    { value: "05" },
    { value: "06" },
    { value: "07" },
    { value: "08" },
    { value: "09" },
    { value: "10" },
    { value: "11" },
    { value: "12" }
  ];
  dateNaissance: DateDecomposee;

  @ViewChild('moisDateNaissance', { read: ElementRef }) moisDateNaissanceInput:ElementRef;
  @ViewChild('anneeDateNaissance', { read: ElementRef }) anneeDateNaissanceInput:ElementRef;

  nationaliteSelectOptions = [
    { label: "française"},
    { label: "ressortissant européen ou suisse"},
    { label: "autre"}
  ];

  constructor(
    private dateUtileService: DateUtileService,
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    public numberUtileService: NumberUtileService,
    private router: Router
  ) { }

  onChangeOrKeyUpDateNaissanceJour(event) {
    event.stopPropagation();
    const value = this.dateNaissance.jour;
    if(value.length === 2) {
      this.moisDateNaissanceInput.nativeElement.focus();
    }
  }

  onChangeOrKeyUpDateNaissanceMois(event) {
    event.stopPropagation();
    const value = this.dateNaissance.mois;
    if(value.length === 2) {
      this.anneeDateNaissanceInput.nativeElement.focus();
    }
  }

  onFocusJourDateNaissance() {
    this.dateNaissance.messageErreurFormat = undefined;
  }


  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    this.dateNaissance = this.dateUtileService.getDateDecomposeeFromDate(this.demandeurEmploiConnecte.informationsIdentite.dateNaissance);
  }

  redirectVersPagePrecedente() {
    this.saveDateDemandeurEmploiConnecte();
    this.router.navigate([RoutesEnum.MON_FUTUR_DE_TRAVAIL], { replaceUrl: true });
  }

  redirectVersPageSuivante(form: FormGroup) {
    this.submitted = true;
    this.saveDateDemandeurEmploiConnecte();
    if(form.valid && !this.dateNaissance.messageErreurFormat) {
      this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      this.router.navigate([RoutesEnum.MA_SITUATION_FAMILIALE], { replaceUrl: true });
    }
  }

  unsetTitreSejourEnFranceValide(nationalite: string) {
    if(nationalite !== 'autre') {
      this.demandeurEmploiConnecte.informationsIdentite.titreSejourEnFranceValide = null;
    }
  }

  setDemandeurEmploiConjoint() {
    if(this.demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      const conjoint = new Personne();
      conjoint.ressourcesFinancieres = new RessourcesFinancieres();
      this.demandeurEmploiConnecte.situationFamiliale.conjoint = conjoint;
    } else {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint = null;
    }
  }
  saveDateDemandeurEmploiConnecte() {
    this.dateNaissance.messageErreurFormat = this.dateUtileService.checkFormat(this.dateNaissance);
    if(!this.dateNaissance.messageErreurFormat
      && this.dateNaissance.jour
      && this.dateNaissance.mois
      && this.dateNaissance.annee) {
        this.demandeurEmploiConnecte.informationsIdentite.dateNaissance = this.dateUtileService.getDateFromDateDecomposee(this.dateNaissance);
   }
  }
}
