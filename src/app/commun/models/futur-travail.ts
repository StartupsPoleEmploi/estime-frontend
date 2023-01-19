import { Salaire } from "@models/salaire";
import { TypeDureeHebdoEnum } from "../enumerations/enumerations-formulaire/type-duree-hebdo.enum";

export class FuturTravail {
  hasOffreEmploiEnVue: boolean;
  distanceKmDomicileTravail: number;
  nombreHeuresTravailleesSemaine: number;
  nombreMoisContratCDD: number;
  nombreTrajetsDomicileTravail: number;
  salaire: Salaire;
  typeContrat: string;
  typeDureeHebdo: string;
  typeSalaireSouhaite: string;
  typeNombreTrajetsSemaine: string;
  typeDistanceDomicileTravail: string;
}