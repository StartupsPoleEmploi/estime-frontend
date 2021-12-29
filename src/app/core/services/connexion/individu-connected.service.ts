import { Injectable } from '@angular/core';
import { Individu } from '@models/individu';
import { Observable, Subject } from 'rxjs';
import { CookiesEstimeService } from '../storage/cookies-estime.service';
import { SessionStorageEstimeService } from '../storage/session-storage-estime.service';
import { IndividuConnectePeConnectAuthorization } from "@models/individu-connecte-pe-connect-authorization";
import { PeConnectAuthorization } from '@app/commun/models/pe-connect-authorization';

@Injectable({ providedIn: 'root' })
export class IndividuConnectedService {

  individuConnecte: Individu;
  individuConnectePeConnectAuthorization: IndividuConnectePeConnectAuthorization;
  isStatutIndividuChangedSubject: Subject<boolean>;
  statutIndividuChanged: Observable<boolean>;

  constructor(
    private cookiesEstimeService: CookiesEstimeService,
    private sessionStorageEstimeService: SessionStorageEstimeService

  ) {
    this.isStatutIndividuChangedSubject = new Subject<boolean>();
    this.statutIndividuChanged = this.isStatutIndividuChangedSubject.asObservable();
  }

  public getIndividuConnected(): Individu {
    if (!this.individuConnecte) {
      const individuConnected = this.sessionStorageEstimeService.getIndividuConnected();
      individuConnected.peConnectAuthorization = this.getPeConnectAuthorization();
      this.individuConnecte = individuConnected;
    }
    return this.individuConnecte;
  }

  public saveIndividuConnected(individu: Individu): void {
    const individuConnectePeConnectAuthorization = this.createIndividuConnectePeConnectAuthorization(individu);
    this.individuConnectePeConnectAuthorization = individuConnectePeConnectAuthorization;
    //pour des raison de sécurité, on stocke les données authorization dans un cookie et non dans session storage
    this.cookiesEstimeService.storeIndividuConnectePeConnectAuthorization(individuConnectePeConnectAuthorization);
    individu.peConnectAuthorization = null;
    this.sessionStorageEstimeService.storeIndividuConnecte(individu);
    this.isStatutIndividuChangedSubject.next(true);
  }

  public emitIndividuConnectedLogoutEvent(): void {
    this.isStatutIndividuChangedSubject.next(false);
  }

  public isLoggedIn(): boolean {
    return this.cookiesEstimeService.getIndividuConnectePeConnectAuthorization() !== null;
  }

  private createIndividuConnectePeConnectAuthorization(individuConnecte: Individu): IndividuConnectePeConnectAuthorization {
    const individuConnectePeConnectAuthorization = new IndividuConnectePeConnectAuthorization();
    individuConnectePeConnectAuthorization.idPoleEmploi = individuConnecte.idPoleEmploi
    individuConnectePeConnectAuthorization.peConnectAuthorization = individuConnecte.peConnectAuthorization;
    return individuConnectePeConnectAuthorization;
  }

  private getPeConnectAuthorization(): PeConnectAuthorization {
    if (!this.individuConnectePeConnectAuthorization) {
      this.individuConnectePeConnectAuthorization = this.cookiesEstimeService.getIndividuConnectePeConnectAuthorization();
    }
    return this.individuConnectePeConnectAuthorization.peConnectAuthorization;
  }
}