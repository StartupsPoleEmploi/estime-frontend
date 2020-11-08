import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { KeysSessionStorageEnum } from "@enumerations/keys-session-storage.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { FuturTravail } from '@models/futur-travail';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { Personne } from '@models/personne';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { SituationFamiliale } from '@models/situation-familiale';
import { SituationPersonne } from "@models/situation-personne";
import { SessionStorageService } from "ngx-webstorage";
import { EstimeApiService } from '../estime-api/estime-api.service';
import { PersonneUtileService } from './personne-utile.service';

@Injectable({ providedIn: 'root' })
export class DemandeurEmploiConnecteService {

  private demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    private estimeApiService: EstimeApiService,
    private numberUtileService: NumberUtileService,
    public personneUtileService: PersonneUtileService,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {

  }

  public simulerMesAides(): Promise<any> {

    return this.estimeApiService.simulerMesAides(this.demandeurEmploiConnecte).then(
      (demandeurEmploi) => {
        this.setDemandeurEmploiConnecte(demandeurEmploi);
        this.router.navigate([RoutesEnum.RESULAT_MA_SIMULATION], { replaceUrl: true });
      }, (erreur) => {
        return erreur;
      }
    );
  }

  public getDemandeurEmploiConnecte(): DemandeurEmploi {
    if (!this.demandeurEmploiConnecte) {
      this.demandeurEmploiConnecte = this.sessionStorageService.retrieve(KeysSessionStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    }
    return this.demandeurEmploiConnecte;
  }

  public setDemandeurEmploiConnecte(demandeurEmploi: DemandeurEmploi): void {
    this.demandeurEmploiConnecte = demandeurEmploi;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setPersonnesACharge(personnesACharge: Array<Personne>) {
    this.demandeurEmploiConnecte.situationFamiliale.personnesACharge = personnesACharge;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setFuturTravail(futurTravail: FuturTravail) {
    futurTravail.salaireMensuelNet = this.numberUtileService.replaceCommaByDot(futurTravail.salaireMensuelNet);
    this.demandeurEmploiConnecte.futurTravail = futurTravail;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setInformationsPersonnelles(informationsPersonnelles: InformationsPersonnelles): void {
    this.demandeurEmploiConnecte.informationsPersonnelles = informationsPersonnelles;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setRessourcesFinancieres(ressourcesFinancieres: RessourcesFinancieres) {
    const ressourcesFinancieresMontantsAvecDot = this.replaceCommaByDotMontantsRessourcesFinancieres(ressourcesFinancieres);
    this.demandeurEmploiConnecte.ressourcesFinancieres = ressourcesFinancieresMontantsAvecDot;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setRessourceFinanciereConjoint(conjoint: Personne) {
    const ressourcesFinancieresMontantsAvecDot = this.replaceCommaByDotMontantsRessourcesFinancieres(conjoint.ressourcesFinancieres);
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres = ressourcesFinancieresMontantsAvecDot;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setSituationFamiliale(isEnCouple: boolean, situationConjoint: SituationPersonne): void {
    if (!this.demandeurEmploiConnecte.situationFamiliale) {
      this.demandeurEmploiConnecte.situationFamiliale = new SituationFamiliale();
    }
    this.demandeurEmploiConnecte.situationFamiliale.isEnCouple = isEnCouple;
    if (isEnCouple) {
      this.creerOuModifierConjoint(situationConjoint);
    } else {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint = null;
    }
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public unsetAllocationMensuelleNetAAH(): void {
    this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
  }

  public unsetRevenusCreateurEntreprise(): void {
    this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise = null;
  }

  public unsetRevenusImmobilier(): void {
    this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier = null;
  }

  public hasRevenusImmobilier(): boolean {
    return this.demandeurEmploiConnecte.informationsPersonnelles.hasRevenusImmobilier === true
  }

  public hasSituationExceptionnelle(): boolean {
    return this.demandeurEmploiConnecte.informationsPersonnelles.hasRevenusImmobilier
      || this.demandeurEmploiConnecte.informationsPersonnelles.isCreateurEntreprise
      || this.demandeurEmploiConnecte.informationsPersonnelles.isHandicape;
  }

  public isCreateurEntreprise(): boolean {
    return this.demandeurEmploiConnecte.informationsPersonnelles.isCreateurEntreprise === true
  }

  public isEnCouple(): boolean {
    return this.demandeurEmploiConnecte.situationFamiliale?.isEnCouple;
  }

  public isHandicape(): boolean {
    return this.demandeurEmploiConnecte.informationsPersonnelles.isHandicape;
  }

  public modifierSituationConjoint(situationConjoint: SituationPersonne) {
    this.modifierSituationConjointHandicape(situationConjoint);
    if (situationConjoint.isSalarie) {
      this.modifierSituationConjointEnSalarie();
    }
    if (situationConjoint.isSansEmploi) {
      this.modifierSituationConjointEnSansEmploi();
    }
  }

  /**
   * Méthode permettant de remplacer les virgules présentes dans les montants
   * pour lesquels on autorise l'utilisateur à saisir un montant avec une virgule ou un point.
   *
   * Transformation nécessaire car seul le point est autoriser côté serveur.
   *
   * TODO JLA : à voir si on ne peut pas faire mieux avec un pipe.
   * Peut-être pas possible car l'utilisation d'un pipe avec le two way data binding ne fonctionne pas.
   */
  public replaceCommaByDotMontantsRessourcesFinancieres(ressourcesFinancieres: RessourcesFinancieres) {
    if (ressourcesFinancieres.allocationsPoleEmploi) {
      ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNetARE = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNetARE);
      ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNetASS = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNetASS);
      ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE);
      ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS);
    }
    if (ressourcesFinancieres.allocationsCAF) {
      ressourcesFinancieres.allocationsCAF.allocationsFamilialesMensuellesNetFoyer = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationsFamilialesMensuellesNetFoyer);
      ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer);
      ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH);
      ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA);
    }
    ressourcesFinancieres.salaireNet  = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.salaireNet);
    ressourcesFinancieres.revenusCreateurEntreprise = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.revenusCreateurEntreprise);
    ressourcesFinancieres.revenusImmobilier = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.revenusImmobilier);
    return ressourcesFinancieres;
  }

  private modifierSituationConjointHandicape(situationConjoint: SituationPersonne) {
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isHandicape = situationConjoint.isHandicape;
    if (!situationConjoint.isHandicape) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
    }
  }

  private modifierSituationConjointEnSansEmploi() {
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSansEmploi = true;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSalarie = false;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.salaireNet = null;
    if (!this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSansEmploi) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    }
  }

  private modifierSituationConjointEnSalarie() {
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSalarie = true;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSansEmploi = false;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
    if (!this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSalarie) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.salaireNet = null;
    }
  }

  private creerOuModifierConjoint(situationConjoint: SituationPersonne): void {
    //si demandeurEmploiConnecte pas de conjoint, on instancie un conjoint
    if (!this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint = this.personneUtileService.creerPersonne();
    }
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isHandicape = situationConjoint.isHandicape;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSalarie = situationConjoint.isSalarie;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSansEmploi = situationConjoint.isSansEmploi;
  }

  private saveDemandeurEmploiConnecteInSessionStorage(): void {
    this.sessionStorageService.store(KeysSessionStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY, this.demandeurEmploiConnecte);
  }
}