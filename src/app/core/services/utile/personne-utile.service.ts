
import { Injectable } from '@angular/core';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { DateDecomposee } from '@models/date-decomposee';
import { AidesCAF } from "@models/aides-caf";
import { AidesPoleEmploi } from "@models/aides-pole-emploi";
import { AidesCPAM } from "@models/aides-cpam";
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
  personne.beneficiaireAides = this.initBeneficiaireAides();
    personne.informationsPersonnelles = new InformationsPersonnelles();
    personne.informationsPersonnelles.salarie = false;
    personne.informationsPersonnelles.sansRessource = false;
    if(isAvecRessourcesFinancieres) {
      personne.ressourcesFinancieres = new RessourcesFinancieres();
      personne.ressourcesFinancieres.aidesCAF = new AidesCAF();
      personne.ressourcesFinancieres.aidesPoleEmploi = new AidesPoleEmploi();
      personne.ressourcesFinancieres.aidesCPAM = new AidesCPAM();
      personne.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite = 0;
    }
    return personne;
  }

  public hasRessourcesFinancieres(personne: Personne): boolean {
    let hasRessourcesFinancieres = false;
    if (personne.informationsPersonnelles) {
      if (!personne.informationsPersonnelles.sansRessource
        && (personne.informationsPersonnelles.salarie
          || this.hasRessourcesAides(personne)
          || this.hasRevenus(personne))) {
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
    if(personne.beneficiaireAides.beneficiaireARE) {
      isValide = personne.ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationMensuelleNet > 0;
    }
    if(personne.beneficiaireAides.beneficiaireASS) {
      isValide = personne.ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationMensuelleNet > 0;
    }
    if(personne.beneficiaireAides.beneficiaireRSA) {
      isValide = personne.ressourcesFinancieres.aidesCAF.allocationRSA > 0;
    }
    if(personne.beneficiaireAides.beneficiaireAAH) {
      isValide = personne.ressourcesFinancieres.aidesCAF.allocationAAH > 0;
    }
    if(personne.beneficiaireAides.beneficiairePensionInvalidite) {
      isValide = personne.ressourcesFinancieres.aidesCPAM.pensionInvalidite > 0;
    }
    return isValide;
  }

  public isBeneficiaireSeulementRSA(personne: Personne): boolean{
    let isBeneficiare = false
    if(personne !== null){
      isBeneficiare = !personne.beneficiaireAides.beneficiaireARE
      && !personne.beneficiaireAides.beneficiaireAAH
      && !personne.beneficiaireAides.beneficiaireASS
      && !personne.beneficiaireAides.beneficiairePensionInvalidite
      && personne.beneficiaireAides.beneficiaireRSA;
    }
    return isBeneficiare;
  }

  private hasRessourcesAides(personne: Personne): boolean {
    return personne.beneficiaireAides
      && (
        personne.beneficiaireAides.beneficiaireAAH
        || personne.beneficiaireAides.beneficiaireARE
        || personne.beneficiaireAides.beneficiaireASS
        || personne.beneficiaireAides.beneficiaireRSA
        || personne.beneficiaireAides.beneficiairePensionInvalidite
      );
  }

  private hasRevenus(personne: Personne): boolean {
    return personne.informationsPersonnelles
      && (
        personne.informationsPersonnelles.hasRevenusImmobilier
        || personne.informationsPersonnelles.microEntrepreneur
        || personne.informationsPersonnelles.travailleurIndependant
      );
  }

  private initBeneficiaireAides(): BeneficiaireAides {
    const beneficiaireAides = new BeneficiaireAides();
    beneficiaireAides.beneficiaireAAH = false;
    beneficiaireAides.beneficiaireARE = false;
    beneficiaireAides.beneficiaireASS = false;
    beneficiaireAides.beneficiairePensionInvalidite = false;
    beneficiaireAides.beneficiaireRSA = false;
    beneficiaireAides.beneficiaireAPL = false;
    beneficiaireAides.beneficiaireALF = false;
    beneficiaireAides.beneficiaireALS = false;
    return beneficiaireAides
  }
}

