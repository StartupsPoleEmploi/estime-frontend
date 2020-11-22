import { Injectable } from '@angular/core';
import { Temoignage } from '@models/temoignage';


@Injectable({providedIn: 'root'})
export class TemoignageService {

  temoignages: Array<Temoignage>;

  constructor() {
    this.initTemoignages();
  }

  public getTemoignages(): Array<Temoignage> {
    return this.temoignages;
  }

  private initTemoignages(): void {
    this.temoignages = new Array<Temoignage>();

    const temoignage1 = new Temoignage();
    temoignage1.temoignage = '"C\'est très bien de savoir qu\'on ne va pas perdre, j\'avais très peur de perdre des aides, de ne pas y arriver."';
    temoignage1.auteur = "Ibanez"
    this.temoignages.push(temoignage1);

    const temoignage2 = new Temoignage();
    temoignage2.temoignage = '"Je recommande. C\'est une bonne idée et un bon site. Il suffit de lire et c\'est compréhensible par tous."';
    temoignage2.auteur = "Cynthia"
    this.temoignages.push(temoignage2);

    const temoignage3 = new Temoignage();
    temoignage3.temoignage = '"C’est vraiment du pas-à-pas, facile à comprendre et à faire."';
    temoignage3.auteur = "Rémi"
    this.temoignages.push(temoignage3);
  }
}