
import { Injectable } from '@angular/core';
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { DateDecomposee } from '@models/date-decomposee';
import { AllocationsCAF } from "@models/allocations-caf";
import { AllocationsPoleEmploi } from "@models/allocations-pole-emploi";
import { AllocationsCPAM } from "@models/allocations-cpam";
import { InformationsPersonnelles } from "@models/informations-personnelles";
import { Personne } from "@models/personne";
import { RessourcesFinancieres } from "@models/ressources-financieres";
import { DateUtileService } from './date-util.service';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class PersonneUtileService {

  AGE_LEGAL_POUR_TRAVAILLE = 16;

  constructor(
    private dateUtileService: DateUtileService
  ) {

  }

  public creerPersonne(isAvecRessourcesFinancieres: boolean): Personne {
    const personne = new Personne();
  personne.beneficiaireAidesSociales = this.initBeneficiaireAidesSociales();
    personne.informationsPersonnelles = new InformationsPersonnelles();
    personne.informationsPersonnelles.salarie = false;
    personne.informationsPersonnelles.sansRessource = false;
    if(isAvecRessourcesFinancieres) {
      personne.ressourcesFinancieres = new RessourcesFinancieres();
      personne.ressourcesFinancieres.allocationsCAF = new AllocationsCAF();
      personne.ressourcesFinancieres.allocationsPoleEmploi = new AllocationsPoleEmploi();
      personne.ressourcesFinancieres.allocationsCPAM = new AllocationsCPAM();
      personne.ressourcesFinancieres.allocationsCPAM.allocationSupplementaireInvalidite = 0;
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

  public isAgeInferieurA3Ans(dateNaissanceString: string): boolean {
    let dateNaissance = moment(dateNaissanceString,'YYYY-MM-DD').toDate();
    return this.dateUtileService.isDatePlusDe3AnsEt1Mois(dateNaissance);
  }

  public isRessourcesFinancieresValides(personne: Personne): boolean {
    let isValide = true;
    if(personne.informationsPersonnelles && personne.informationsPersonnelles.salarie) {
      isValide = personne.ressourcesFinancieres.salaire.montantNet > 0;
    }
    if(personne.beneficiaireAidesSociales.beneficiaireARE || personne.beneficiaireAidesSociales.beneficiaireASS) {
      isValide = personne.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNet > 0;
    }
    if(personne.beneficiaireAidesSociales.beneficiaireRSA) {
      isValide = personne.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA > 0;
    }
    if(personne.beneficiaireAidesSociales.beneficiaireAAH) {
      isValide = personne.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH > 0;
    }
    if(personne.beneficiaireAidesSociales.beneficiairePensionInvalidite) {
      isValide = personne.ressourcesFinancieres.allocationsCPAM.pensionInvalidite > 0;
    }
    return isValide;
  }

  private hasRessourcesAidesSociales(personne: Personne): boolean {
    return personne.beneficiaireAidesSociales
      && (
        personne.beneficiaireAidesSociales.beneficiaireAAH
        || personne.beneficiaireAidesSociales.beneficiaireARE
        || personne.beneficiaireAidesSociales.beneficiaireASS
        || personne.beneficiaireAidesSociales.beneficiaireRSA
        || personne.beneficiaireAidesSociales.beneficiairePensionInvalidite
      );
  }

  private initBeneficiaireAidesSociales(): BeneficiaireAidesSociales {
    const beneficiaireAidesSociales = new BeneficiaireAidesSociales();
    beneficiaireAidesSociales.beneficiaireAAH = false;
    beneficiaireAidesSociales.beneficiaireARE = false;
    beneficiaireAidesSociales.beneficiaireASS = false;
    beneficiaireAidesSociales.beneficiairePensionInvalidite = false;
    beneficiaireAidesSociales.beneficiaireRSA = false;
    beneficiaireAidesSociales.topAAHRecupererViaApiPoleEmploi = false;
    beneficiaireAidesSociales.topARERecupererViaApiPoleEmploi = false;
    beneficiaireAidesSociales.topASSRecupererViaApiPoleEmploi = false;
    beneficiaireAidesSociales.topRSARecupererViaApiPoleEmploi = false
    return beneficiaireAidesSociales
  }
}

