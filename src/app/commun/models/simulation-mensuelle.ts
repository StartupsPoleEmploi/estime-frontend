import { Aide } from "@models/aide";
import { RessourceFinanciere } from "./ressource-financiere";

export class SimulationMensuelle {
  datePremierJourMoisSimule: string;
  aides: Map<string, Aide>;
  ressourcesFinancieres: Map<string, RessourceFinanciere>;
}