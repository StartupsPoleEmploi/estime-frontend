import { Injectable } from '@angular/core';
import { CookiesEstimeService } from '../storage/cookies-estime.service';
import { Individu } from '@models/individu';
import { Subject, Observable } from 'rxjs';
import { SessionStorageEstimeService } from '../storage/session-storage-estime.service';

@Injectable({ providedIn: 'root' })
export class IndividuConnectedService {

  isStatutIndividuChangedChangedSubject: Subject<boolean>;
  statutIndividuChanged: Observable<boolean>;

  constructor(
    private cookiesEstimeService: CookiesEstimeService
  ) {
    this.isStatutIndividuChangedChangedSubject = new Subject<boolean>();
    this.statutIndividuChanged = this.isStatutIndividuChangedChangedSubject.asObservable();
  }

  public saveIndividuConnected(indidivu: Individu): void {
    this.cookiesEstimeService.storeIndividuConnecte(indidivu);
    this.isStatutIndividuChangedChangedSubject.next(true);
  }

  public emitIndividuConnectedLogoutEvent(): void {
    this.isStatutIndividuChangedChangedSubject.next(false);
  }

  public isLoggedIn(): boolean {
    return this.cookiesEstimeService.getIndividuConnected() !== null;
  }
}