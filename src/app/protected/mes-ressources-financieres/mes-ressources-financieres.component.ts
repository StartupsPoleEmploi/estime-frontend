import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RoutesEnum } from '@enumerations/routes.enum';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { DateDecomposee } from '@models/date-decomposee';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { AllocationsPoleEmploi } from '@models/allocations-pole-emploi';
import { AllocationsCAF } from '@models/allocations-caf';

@Component({
  selector: 'app-mes-ressources-financieres',
  templateUrl: './mes-ressources-financieres.component.html',
  styleUrls: ['./mes-ressources-financieres.component.scss']
})
export class MesRessourcesFinancieresComponent implements OnInit {

  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  dateDernierOuvertureDroitASS: DateDecomposee;
  isRessourcesFinancieresFormSubmitted = false;
  messageErreur: string;
  ressourcesFinancieres: RessourcesFinancieres;

  @ViewChild('moisDateDerniereOuvertureDroitASS', { read: ElementRef }) moisDateDerniereOuvertureDroitASSInput:ElementRef;
  @ViewChild('anneeDateDerniereOuvertureDroitASS', { read: ElementRef }) anneeDateDerniereOuvertureDroitASSInput:ElementRef;

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
    this.loadDataRessourcesFinancieres();
    this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromStringDate(this.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS);
  }

  public onClickButtonRetour(): void {
    this.checkAndSaveDateDernierOuvertureDroitASS();
    this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
  }

  public onSubmitRessourcesFinancieresForm(form: FormGroup): void {
    this.isRessourcesFinancieresFormSubmitted = true;
    this.checkAndSaveDateDernierOuvertureDroitASS();
    if(form.valid) {
      this.demandeurEmploiConnecteService.setRessourcesFinancieres(this.ressourcesFinancieres);
      if(this.demandeurEmploiConnecteService.isEnCouple()) {
        this.router.navigate([RoutesEnum.RESSOURCES_FINANCIERES_CONJOINT], { replaceUrl: true });
      } else {
        this.demandeurEmploiConnecteService.simulerMesAides().then(
          (erreur) => {
            this.messageErreur = "Impossible d'obtenir votre simulation. Merci d'essayer de nouveau et de contacter le support Estime si le problème persiste."
          }
        );
      }
    }
  }

  public onClickRadioButtonHasCumuleAssEtSalaire(): void {
    if(!this.ressourcesFinancieres.allocationsPoleEmploi.hasCumuleAssEtSalaire) {
      this.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesAssEtSalaire = 0;
    }
  }

  public getLibelleBoutonValidationFormulaire():string {
    let libelleBoutonValidationFormulaire = "Obtenir ma simulation";
    if(this.demandeurEmploiConnecteService.isEnCouple()) {
      libelleBoutonValidationFormulaire = "Suivant";
    }
    return libelleBoutonValidationFormulaire;
  }

  private checkAndSaveDateDernierOuvertureDroitASS(): void {
    this.dateDernierOuvertureDroitASS.messageErreurFormat = this.dateUtileService.checkFormat(this.dateDernierOuvertureDroitASS);
    if(this.dateUtileService.isDateDecomposeeSaisieValide(this.dateDernierOuvertureDroitASS)) {
      this.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS = this.dateUtileService.getStringDateFromDateDecomposee(this.dateDernierOuvertureDroitASS);
    }
  }

  private loadDataRessourcesFinancieres(): void {
    const demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.ressourcesFinancieres) {
      this.ressourcesFinancieres = demandeurEmploiConnecte.ressourcesFinancieres;
    } else {
      this.ressourcesFinancieres = new RessourcesFinancieres();
      const allocationsPE = new AllocationsPoleEmploi();
      allocationsPE.nombreMoisCumulesAssEtSalaire = 0;
      this.ressourcesFinancieres.allocationsPoleEmploi = allocationsPE;
      const allocationsCAF = new AllocationsCAF();
      this.ressourcesFinancieres.allocationsCAF = allocationsCAF;
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
