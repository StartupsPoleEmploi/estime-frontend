import Engine, { formatValue } from "publicodes";
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

        //TODO JLA : demande d'évolutiond la lib en cours https://gitter.im/publicodes/community?utm_source=notification&utm_medium=email&utm_campaign=unread-notifications
        // La librairie insère des espaces entre les milliers qu'il est nécessaire de supprimer (exemple : 1 000 => 1000)
        return Math.round(Number(formatValue(montantNet, this.formatOptions).replace(/\s/g, "").replace(/,/g, ".")));
    }

    public getBrutFromNet(montantNet: number): number {
        const montantBrut =
            this.engine
                .setSituation({
                    "contrat salarié . rémunération . net": montantNet
                })
                .evaluate("contrat salarié . rémunération . brut de base");

        //TODO JLA : demande d'évolutiond la lib en cours https://gitter.im/publicodes/community?utm_source=notification&utm_medium=email&utm_campaign=unread-notifications
        //La librairie insère des espaces entre les milliers qu'il est nécessaire de supprimer (exemple : 1 000 => 1000)
        return Math.round(Number(formatValue(montantBrut, this.formatOptions).replace(/\s/g, "").replace(/,/g, ".")));
    }
}