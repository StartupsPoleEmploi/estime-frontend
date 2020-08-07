import { Injectable, Inject } from '@angular/core';
import { UserManager, User } from "oidc-client";
import { Subject } from 'rxjs';
import { __metadata } from 'tslib';
import { Environment } from '@app/commun/models/environment.model';


@Injectable({providedIn: 'root'})
export class AuthService {

  private userManager: UserManager;
  private user: User;
  private loginChangedSubject = new Subject<boolean>();

  loginChanged = this.loginChangedSubject.asObservable();

  constructor(private environment: Environment) {
    const peamSettings = {
      authority: `${environment.oidcSTSAutority}authorize?realm=%2Findividu&nonce=E17DrKm7bsND9tR1lCik04MDDzFrq2SgpFELoD4T2zKxRUNqfKzHD1aJghnTxUSw`,
      client_id: environment.oidcClientId,
      client_secret: environment.oidcClientSecret,
      redirect_uri: `${environment.oidcRedirectURI}signin-callback`,
      scope: environment.oidcSCOPE,
      response_type: 'code',
      metadata: {
        issuer: environment.oidcIssuerURI,
        authorization_endpoint: `${environment.oidcSTSAutority}authorize?realm=%2Findividu&nonce=E17DrKm7bsND9tR1lCik04MDDzFrq2SgpFELoD4T2zKxRUNqfKzHD1aJghnTxUSw`,
        userinfo_endpoint: environment.oidcUserInfoURI,
        end_session_endpoint: `${environment.oidcRedirectURI}signout-callback`,
        token_endpoint: `${environment.oidcSTSAutority}access_token?realm=/individu`,
        jwks_uri: environment.oidcJwksURI,
      }
    };

    this.userManager = new UserManager(peamSettings);
  }

  login() {
    return this.userManager.signinRedirect();
  }

  isLoggedIn(): Promise<boolean> {
    return this.userManager.getUser().then(user => {
      const userCurrent = !!user &&!user.expired;
      if (this.user !== user) {
        this.loginChangedSubject.next(userCurrent);
      }
      this.user = user;
      return userCurrent;
    });
  }

  completeLogin() {
    return this.userManager.signinRedirectCallback().then(user => {
      this.user = user;
      this.loginChangedSubject.next(!!user && !user.expired);
      return user;
    });
  }

  logout() {
    this.userManager.signoutRedirect();
  }

  completeLogout() {
    this.user = null;
    return this.userManager.signoutRedirectCallback();
  }

}
