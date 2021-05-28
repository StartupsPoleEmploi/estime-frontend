import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CodeDepartementUtile {

    private CODE_DEPARTEMENT_VAL_OISE: number = 95;

    public getCodeDepartement(codePostal: string): string {
        const deuxPremiersCaracteresCodePostal = Number(codePostal.substr(0, 2));
        if(Number.isFinite(deuxPremiersCaracteresCodePostal) && deuxPremiersCaracteresCodePostal > this.CODE_DEPARTEMENT_VAL_OISE) {
            return codePostal.substr(0, 3);
        }
        return String(deuxPremiersCaracteresCodePostal);
    }
}