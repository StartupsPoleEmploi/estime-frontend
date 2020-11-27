
import { Injectable } from '@angular/core';
import { BeneficiaireAidesSociales } from '@app/commun/models/beneficiaire-aides-sociales';
import { DateDecomposee } from '@app/commun/models/date-decomposee';
import { AllocationsCAF } from "@models/allocations-caf";
import { AllocationsPoleEmploi } from "@models/allocations-pole-emploi";
import { InformationsPersonnelles } from "@models/informations-personnelles";
import { Personne } from "@models/personne";
import { RessourcesFinancieres } from "@models/ressources-financieres";
import { DateUtileService } from './date-util.service';

@Injectable({ providedIn: 'root' })
export class PersonneUtileService {

  AGE_LEGAL_POUR_TRAVAILLE = 16;

  constructor(
    private dateUtileService: DateUtileService
  ) {

  }

  public creerPersonne(isAvecRessourcesFinancieres: boolean): Personne {
    const personne = new Personne();
    personne.beneficiaireAidesSociales = new BeneficiaireAidesSociales(false, false, false, false);
    personne.informationsPersonnelles = new InformationsPersonnelles();
    personne.informationsPersonnelles.salarie = false;
    personne.informationsPersonnelles.sansRessource = false;
    if(isAvecRessourcesFinancieres) {
      personne.ressourcesFinancieres = new RessourcesFinancieres();
      personne.ressourcesFinancieres.allocationsCAF = new AllocationsCAF();
      personne.ressourcesFinancieres.allocationsPoleEmploi = new AllocationsPoleEmploi();
    }
    return personne;
  }

  public hasRessourcesFinancieres(personne: Personne): boolean {
    let hasRessourcesFinancieres = false;
    if (personne.informationsPersonnelles) {
      if (!personne.informationsPersonnelles.sansRessource
        && (personne.informationsPersonnelles.salarie
          || this.hasRessourcesAidesSociales(personne))) {
        hasRessourcesFinancieres = true;
      }
    }
    return hasRessourcesFinancieres;
  }

  public isAgeLegalPourTravailler(dateNaissance: DateDecomposee): boolean {
    const dateNaissanceFormatDate = this.dateUtileService.getDateFromDateDecomposee(dateNaissance);
    const diffEnMilliseconds = Date.now() - dateNaissanceFormatDate.getTime();
    const dateAge = new Date(diffEnMilliseconds);
    const ageEnAnnee = Math.abs(dateAge.getUTCFullYear() - 1970);
    return ageEnAnnee >= this.AGE_LEGAL_POUR_TRAVAILLE ? true : false;
  }

  private hasRessourcesAidesSociales(personne: Personne): boolean {
    return personne.beneficiaireAidesSociales
      && (
        personne.beneficiaireAidesSociales.beneficiaireAAH
        || personne.beneficiaireAidesSociales.beneficiaireARE
        || personne.beneficiaireAidesSociales.beneficiaireASS
        || personne.beneficiaireAidesSociales.beneficiaireRSA
      );
  }
}

