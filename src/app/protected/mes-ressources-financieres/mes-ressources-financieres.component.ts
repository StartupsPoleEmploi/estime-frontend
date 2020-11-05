import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RoutesEnum } from '@enumerations/routes.enum';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { Router } from '@angular/router';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { FormGroup } from '@angular/forms';
import { DateDecomposee } from '@models/date-decomposee';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';

@Component({
  selector: 'app-mes-ressources-financieres',
  templateUrl: './mes-ressources-financieres.component.html',
  styleUrls: ['./mes-ressources-financieres.component.scss']
})
export class MesRessourcesFinancieresComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  isRessourcesFinancieresFormSubmitted = false;
  dateDernierOuvertureDroitASS: DateDecomposee;
  @ViewChild('moisDateDerniereOuvertureASS', { read: ElementRef }) moisDateDerniereOuvertureASSInput:ElementRef;
  @ViewChild('anneeDateDerniereOuvertureASS', { read: ElementRef }) anneeDateDerniereOuvertureASSInput:ElementRef;

  nombreMoisCumulAssSalaireSelectOptions = [
    { label: "1 mois", value: 1, default: true },
    { label: "2 mois", value: 2, default: false },
    { label: "3 mois", value: 3, default: false }
  ];

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    public estimeApiService: EstimeApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialisationPage();
  }

  initialisationPage() {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromDate(this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitAllocationSolidariteSpecifique);
  }

  getLibelleBoutonValidationFormulaire():string {
    let libelleBoutonValidationFormulaire = "Obtenir ma simulation";
    if(this.demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      libelleBoutonValidationFormulaire = "Suivant";
    }
    return libelleBoutonValidationFormulaire;
  }
  onChangeOrKeyUpDateDerniereOuvertureASSJour(event) {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.jour;
    if(value && value.length === 2) {
      this.moisDateDerniereOuvertureASSInput.nativeElement.focus();
    }
  }

  onChangeOrKeyUpDateDerniereOuvertureASSMois(event) {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.mois;
    if(value && value.length === 2) {
      this.anneeDateDerniereOuvertureASSInput.nativeElement.focus();
    }
  }

  onFocusDateDerniereOuvertureASS() {
    this.dateDernierOuvertureDroitASS.messageErreurFormat = undefined;
  }

  redirectVersPagePrecedente() {
    this.checkAndSaveDateDernierOuvertureDroitASS();
    this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
  }

  redirectVersPageSuivante(form: FormGroup) {
    this.isRessourcesFinancieresFormSubmitted = true;
    this.checkAndSaveDateDernierOuvertureDroitASS();
    if(form.valid) {
      this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      if(this.demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
        this.router.navigate([RoutesEnum.RESSOURCES_FINANCIERES_CONJOINT], { replaceUrl: true });
      } else {
        this.estimeApiService.simulerMesAides(this.demandeurEmploiConnecte).then(
          (demandeurEmploi) => {
            this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(demandeurEmploi);
            this.router.navigate([RoutesEnum.RESULAT_MA_SIMULATION], { replaceUrl: true });
          }, (erreur) => {
            const test = "coucou";
            //TODO JLA : traiter l'erreur
          }
        );
      }
    }
  }

  unsetNombreMoisCumulesASSPercueEtSalaire(hasASSPlusSalaireCumule: boolean) {
    if(!hasASSPlusSalaireCumule) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesASSPercueEtSalaire = null;
    }
  }

  checkAndSaveDateDernierOuvertureDroitASS() {
    this.dateDernierOuvertureDroitASS.messageErreurFormat = this.dateUtileService.checkFormat(this.dateDernierOuvertureDroitASS);
    if(this.dateUtileService.isDateDecomposeeSaisieValide(this.dateDernierOuvertureDroitASS)) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitAllocationSolidariteSpecifique = this.dateUtileService.getDateFromDateDecomposee(this.dateDernierOuvertureDroitASS);
    }
  }

}
