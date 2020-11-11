import { Injectable } from '@angular/core';
import { DateUtileService } from './date-util.service';
import { DateDecomposee } from '@models/date-decomposee';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { AllocationsCAF } from '@models/allocations-caf';
import { AllocationsPoleEmploi } from '@models/allocations-pole-emploi';
import { Personne } from '@models/personne';

@Injectable({providedIn: 'root'})
export class PersonneUtileService {

  private readonly AGE_LEGAL_POUR_TRAVAILLE = 16;

  constructor(
    private dateUtileService: DateUtileService
  ) {

  }

  isAgeLegalPourTravailler(dateNaissance: DateDecomposee): boolean {
    const dateNaissanceFormatDate = this.dateUtileService.getDateFromDateDecomposee(dateNaissance);
    const diffEnMilliseconds = Date.now() - dateNaissanceFormatDate.getTime();
    const dateAge = new Date(diffEnMilliseconds);
    const ageEnAnnee = Math.abs(dateAge.getUTCFullYear() - 1970);
    return ageEnAnnee >= this.AGE_LEGAL_POUR_TRAVAILLE ? true : false;
  }

  public isSituationCorrect(personne: Personne): boolean {
    return personne.informationsPersonnelles.isSalarie
    || personne.informationsPersonnelles.isSansEmploi;
  }

  public creerPersonne(): Personne {
    const personne = new Personne();
    personne.informationsPersonnelles = new InformationsPersonnelles();
    personne.ressourcesFinancieres = new RessourcesFinancieres();
    personne.ressourcesFinancieres.allocationsCAF = new AllocationsCAF();
    personne.ressourcesFinancieres.allocationsPoleEmploi = new AllocationsPoleEmploi();
    return personne;
  }
}