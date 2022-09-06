import Engine, { formatValue } from "publicodes";
import rules from "modele-social";
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SalaireService {

    private static MONTANT_SMIC_HORAIRE_NET = 8.76;
    // Source : https://www.insee.fr/fr/statistiques/serie/000822501
    private static MONTANT_SMIC_HORAIRE_BRUT = 11.07;


    formatOptions: Object = {
        'precision': 2,
        'displayedUnit': ''
    }
    engine: Engine = new Engine(rules);

    public getNetFromBrut(montantBrut: number, typeContrat: string = 'CDI', tempsDeTravail: number = 35): number {
        const montantNet =
            this.engine
                .setSituation({
                    "contrat salarié": "'" + typeContrat + "'",
                    "contrat salarié . temps de travail": tempsDeTravail * 4.33,
                    "contrat salarié . rémunération . brut de base": montantBrut
                })
                .evaluate("contrat salarié . rémunération . net");

        //TODO JLA : demande d'évolutiond la lib en cours https://gitter.im/publicodes/community?utm_source=notification&utm_medium=email&utm_campaign=unread-notifications
        // La librairie insère des espaces entre les milliers qu'il est nécessaire de supprimer (exemple : 1 000 => 1000)
        return Math.round(Number(formatValue(montantNet, this.formatOptions).replace(/\s/g, "").replace(/,/g, ".")));
    }

    public getBrutFromNet(montantNet: number, typeContrat: string = 'CDI', tempsDeTravail: number = 35): number {
        const montantBrut =
            this.engine
                .setSituation({
                    "contrat salarié": "'" + typeContrat + "'",
                    "contrat salarié . temps de travail": tempsDeTravail * 4.33,
                    "contrat salarié . rémunération . net": montantNet
                })
                .evaluate("contrat salarié . rémunération . brut de base");

        //TODO JLA : demande d'évolutiond la lib en cours https://gitter.im/publicodes/community?utm_source=notification&utm_medium=email&utm_campaign=unread-notifications
        //La librairie insère des espaces entre les milliers qu'il est nécessaire de supprimer (exemple : 1 000 => 1000)
        return Math.round(Number(formatValue(montantBrut, this.formatOptions).replace(/\s/g, "").replace(/,/g, ".")));
    }

    public getSmicMensuelFromNombreHeure(nombreHeure: number, brut = true): number {
        if (brut) return this.getSmicMensuelBrutFromNombreHeure(nombreHeure);
        return this.getSmicMensuelNetFromNombreHeure(nombreHeure)
    }

    public getMontantMensuelFromMontantHoraire(montantHoraire: number, nombreHeureSemaine: number = 35): number {
        if (nombreHeureSemaine == null) nombreHeureSemaine = 35;
        return Math.floor(montantHoraire * nombreHeureSemaine * (52 / 12));
    }

    public getMontantHoraireFromMontantMensuel(montantMensuel: number, nombreHeureSemaine: number = 35): number {
        if (nombreHeureSemaine == null) nombreHeureSemaine = 35;
        return Math.floor(montantMensuel / nombreHeureSemaine / (52 / 12) * 100) / 100;
    }

    public getSmicMensuelNetFromNombreHeure(nombreHeure: number): number {
        if (nombreHeure == null) nombreHeure = 35;
        return Math.floor(SalaireService.MONTANT_SMIC_HORAIRE_NET * nombreHeure * (52 / 12));
    }

    public getSmicMensuelBrutFromNombreHeure(nombreHeure: number): number {
        if (nombreHeure == null) nombreHeure = 35;
        return Math.floor(SalaireService.MONTANT_SMIC_HORAIRE_BRUT * nombreHeure * (52 / 12));
    }
}