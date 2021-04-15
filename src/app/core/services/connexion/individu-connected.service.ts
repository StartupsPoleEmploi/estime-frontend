import { Injectable } from '@angular/core';
import { Individu } from '@models/individu';
import { Observable, Subject } from 'rxjs';
import { CookiesEstimeService } from '../storage/cookies-estime.service';

@Injectable({ providedIn: 'root' })
export class IndividuConnectedService {

  individuConnected: Individu;
  isStatutIndividuChangedSubject: Subject<boolean>;
  statutIndividuChanged: Observable<boolean>;

  constructor(
    private cookiesEstimeService: CookiesEstimeService

  ) {
    this.isStatutIndividuChangedSubject = new Subject<boolean>();
    this.statutIndividuChanged = this.isStatutIndividuChangedSubject.asObservable();
  }

  public getIndividuConnected(): Individu {
    if(!this.individuConnected) {
      this.individuConnected = this.cookiesEstimeService.getIndividuConnected();
    }
    return this.individuConnected;
  }

  public saveIndividuConnected(indidivu: Individu): void {
    this.individuConnected = indidivu;
    this.cookiesEstimeService.storeIndividuConnecte(indidivu);
    this.isStatutIndividuChangedSubject.next(true);
  }

  public emitIndividuConnectedLogoutEvent(): void {
    this.isStatutIndividuChangedSubject.next(false);
  }

  public isLoggedIn(): boolean {
    return this.cookiesEstimeService.getIndividuConnected() !== null;
  }
}