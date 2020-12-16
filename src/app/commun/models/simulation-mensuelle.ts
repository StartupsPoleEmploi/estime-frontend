import { AideSociale } from "@models/aide-sociale";

export class SimulationMensuelle {
  datePremierJourMoisSimule: string;
  mesAides: Map<string, AideSociale>;
}