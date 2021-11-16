
import { Injectable } from '@angular/core';
import { InformationsPersonnelles } from '@app/commun/models/informations-personnelles';
import { Logement } from '@app/commun/models/logement';
import { StatutOccupationLogement } from '@app/commun/models/statut-occupation-logement';

@Injectable({ providedIn: 'root' })
export class InformationsPersonnellesService {

  constructor() { }

  public creerInformationsPersonnelles(): InformationsPersonnelles {
    const informationsPersonnelles = new InformationsPersonnelles();
    informationsPersonnelles.logement = this.creerLogement();
    return informationsPersonnelles;
  }

  public creerLogement(): Logement {
    const logement = new Logement();
    logement.codeInsee = '';
    logement.isChambre = false;
    logement.isColloc = false;
    logement.isConventionne = false;
    logement.isCrous = false;
    logement.isDeMayotte = false;
    logement.montantCharges = 0;
    logement.montantLoyer = 0;
    logement.statutOccupationLogement = this.creerStatutOccupationLogement();
    return logement;
  }

  public creerStatutOccupationLogement(): StatutOccupationLogement {
    const statutOccupationLogement = new StatutOccupationLogement();
    statutOccupationLogement.isLocataireMeuble = false;
    statutOccupationLogement.isLocataireNonMeuble = false;
    statutOccupationLogement.isLocataireHLM = false;
    statutOccupationLogement.isProprietaire = false;
    statutOccupationLogement.isProprietaireAvecEmprunt = false;
    statutOccupationLogement.isLogeGratuitement = false;
    return statutOccupationLogement;

  }
}