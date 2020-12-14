import { Injectable } from '@angular/core';
import { Individu } from '@models/individu';
import { Observable, Subject } from 'rxjs';
import { CookiesEstimeService } from '../storage/cookies-estime.service';

@Injectable({ providedIn: 'root' })
export class IndividuConnectedService {

  individuConnected: Individu;
  isStatutIndividuChangedChangedSubject: Subject<boolean>;
  statutIndividuChanged: Observable<boolean>;

  constructor(
    private cookiesEstimeService: CookiesEstimeService
  ) {
    this.isStatutIndividuChangedChangedSubject = new Subject<boolean>();
    this.statutIndividuChanged = this.isStatutIndividuChangedChangedSubject.asObservable();
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
    this.isStatutIndividuChangedChangedSubject.next(true);
  }

  public emitIndividuConnectedLogoutEvent(): void {
    this.isStatutIndividuChangedChangedSubject.next(false);
  }

  public isLoggedIn(): boolean {
    const isLoggedIn = this.cookiesEstimeService.getIndividuConnected() !== null;
    return isLoggedIn;
  }
}