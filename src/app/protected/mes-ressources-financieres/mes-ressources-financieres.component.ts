import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RoutesEnum } from '@enumerations/routes.enum';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { Router } from '@angular/router';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { FormGroup } from '@angular/forms';
import { DateDecomposee } from '@models/date-decomposee';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';

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
    private dateUtileService: DateUtileService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromDate(this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitAllocationSolidariteSpecifique);
  }

  onChangeOrKeyUpDateDerniereOuvertureASSJour(event) {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.jour;
    if(value.length === 2) {
      this.moisDateDerniereOuvertureASSInput.nativeElement.focus();
    }
  }

  onChangeOrKeyUpDateDerniereOuvertureASSMois(event) {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.mois;
    if(value.length === 2) {
      this.anneeDateDerniereOuvertureASSInput.nativeElement.focus();
    }
  }

  onFocusDateDerniereOuvertureASS() {
    this.dateDernierOuvertureDroitASS.messageErreurFormat = undefined;
  }

  redirectVersPagePrecedente() {
    this.checkAndSaveDateDernierOuvertureDroitASS();
    this.router.navigate([RoutesEnum.MES_INFORMATIONS_IDENTITE], { replaceUrl: true });
  }

  redirectVersPageSuivante(form: FormGroup) {
    this.isRessourcesFinancieresFormSubmitted = true;
    this.checkAndSaveDateDernierOuvertureDroitASS();
    if(form.valid) {
      this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      if(this.demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
        this.router.navigate([RoutesEnum.RESSOURCES_FINANCIERES_CONJOINT], { replaceUrl: true });
      } else {
        this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
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
