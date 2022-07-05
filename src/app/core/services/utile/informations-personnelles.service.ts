
import { Injectable } from '@angular/core';
import { Coordonnees } from '@app/commun/models/coordonnees';
import { InformationsPersonnelles } from '@app/commun/models/informations-personnelles';
import { Logement } from '@app/commun/models/logement';
import { StatutOccupationLogement } from '@app/commun/models/statut-occupation-logement';

@Injectable({ providedIn: 'root' })
export class InformationsPersonnellesService {

  public creerInformationsPersonnelles(): InformationsPersonnelles {
    const informationsPersonnelles = new InformationsPersonnelles();
    informationsPersonnelles.logement = this.creerLogement();
    return informationsPersonnelles;
  }

  public creerLogement(): Logement {
    const logement = new Logement();
    logement.isChambre = false;
    logement.isColloc = false;
    logement.isConventionne = false;
    logement.isCrous = false;
    logement.montantCharges = null;
    logement.montantLoyer = null;
    logement.statutOccupationLogement = this.creerStatutOccupationLogement();
    logement.coordonnees = this.creerCoordonnees();
    return logement;
  }

  private creerStatutOccupationLogement(): StatutOccupationLogement {
    const statutOccupationLogement = new StatutOccupationLogement();
    statutOccupationLogement.isLocataireMeuble = false;
    statutOccupationLogement.isLocataireNonMeuble = false;
    statutOccupationLogement.isLocataireHLM = false;
    statutOccupationLogement.isProprietaire = false;
    statutOccupationLogement.isProprietaireAvecEmprunt = false;
    statutOccupationLogement.isLogeGratuitement = false;
    return statutOccupationLogement;
  }

  private creerCoordonnees(): Coordonnees {
    const coordonnees = new Coordonnees();
    coordonnees.codeInsee = '';
    coordonnees.codePostal = '';
    return coordonnees;
  }
}