import { Salaire } from "@models/salaire";

export class FuturTravail {
  distanceKmDomicileTravail: number;
  nombreHeuresTravailleesSemaine: number;
  nombreMoisContratCDD: number;
  nombreTrajetsDomicileTravail: number;
  salaire: Salaire;
  typeContrat: string;
}