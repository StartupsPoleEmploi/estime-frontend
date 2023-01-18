
import { Injectable } from '@angular/core';
import { Coordonnees } from '@app/commun/models/coordonnees';
import { InformationsPersonnelles } from '@app/commun/models/informations-personnelles';
import { Logement } from '@app/commun/models/logement';
import { MicroEntreprise } from '@app/commun/models/micro-entreprise';
import { StatutOccupationLogement } from '@app/commun/models/statut-occupation-logement';

@Injectable({ providedIn: 'root' })
export class InformationsPersonnellesService {

  public creerInformationsPersonnelles(): InformationsPersonnelles {
    const informationsPersonnelles = new InformationsPersonnelles();
    informationsPersonnelles.nationalite = null;
    informationsPersonnelles.isBeneficiaireACRE = null;
    informationsPersonnelles.logement = this.creerLogement();
    return informationsPersonnelles;
  }

  public creerLogement(): Logement {
    const logement = new Logement();
    logement.isChambre = false;
    logement.isColloc = false;
    logement.isConventionne = false;
    logement.isCrous = false;
    logement.montantLoyer = null;
    logement.statutOccupationLogement = null;
    logement.coordonnees = this.creerCoordonnees();
    return logement;
  }

  private creerCoordonnees(): Coordonnees {
    const coordonnees = new Coordonnees();
    coordonnees.codeInsee = '';
    coordonnees.codePostal = '';
    return coordonnees;
  }

  public creerMicroEntreprise(): MicroEntreprise {
    const microEntreprise = new MicroEntreprise();
    microEntreprise.chiffreAffairesN = null;
    microEntreprise.chiffreAffairesNMoins1 = null;
    microEntreprise.chiffreAffairesNMoins2 = null;
    microEntreprise.deficitNMoins2 = null;
    return microEntreprise;
  }
}