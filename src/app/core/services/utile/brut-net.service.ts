import Engine, { formatValue } from "@internal/publicodes";
import rules from "modele-social";
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class BrutNetService {

    formatOptions: Object = {
        'precision': 2,
        'displayedUnit': ''
    }
    engine: Engine = new Engine(rules);

    public getNetFromBrut(montantBrut: number): number {
        const montantNet =
            this.engine
                .setSituation({
                    "contrat salarié . rémunération . brut de base": montantBrut
                })
                .evaluate("contrat salarié . rémunération . net");

        // La librairie insère des espaces entre les milliers qu'il est nécessaire de supprimer (exemple : 1 000 => 1000)
        return Number(formatValue(montantNet, this.formatOptions).replace(/\s/g, "").replace(/,/g, "."));
    }

    public getBrutFromNet(montantNet: number): number {
        const montantBrut =
            this.engine
                .setSituation({
                    "contrat salarié . rémunération . net": montantNet
                })
                .evaluate("contrat salarié . rémunération . brut de base");

        // La librairie insère des espaces entre les milliers qu'il est nécessaire de supprimer (exemple : 1 000 => 1000)
        return Number(formatValue(montantBrut, this.formatOptions).replace(/\s/g, "").replace(/,/g, "."));
    }
}