import { Salaire } from "@models/salaire";

export class FuturTravail {
  hasOffreEmploiEnVue: boolean;
  distanceKmDomicileTravail: number;
  nombreHeuresTravailleesSemaine: number;
  nombreMoisContratCDD: number;
  nombreTrajetsDomicileTravail: number;
  salaire: Salaire;
  typeContrat: string;
  distanceDomicileTravailEntre0Et9: boolean;
  distanceDomicileTravailEntre10Et19: boolean;
  distanceDomicileTravailEntre20Et30: boolean;
  distanceDomicileTravailPlusDe30: boolean;
  nombreTrajets1JourSemaine: boolean;
  nombreTrajets2JoursSemaine: boolean;
  nombreTrajets3JoursSemaine: boolean;
  nombreTrajets4JoursSemaine: boolean;
  nombreTrajets5JoursSemaine: boolean;
  dureeHebdoTempsPlein: boolean;
  dureeHebdoMiTemps: boolean;
  dureeHebdoAutre: boolean;
  salaireSouhaiteSMIC: boolean;
  salaireSouhaiteAutre: boolean;
}