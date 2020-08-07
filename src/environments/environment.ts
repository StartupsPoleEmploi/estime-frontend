// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEstimeURL: 'http://localhost:8081/estime/v1/',
  /** OpenID Connect PE properties ***/
  oidcClientId: 'PAR_estime_92ac2bd6cc903ee96ac415bab999d13d29a0c1d71de408dc9246162ba99b002d',
  // not good :(
  oidcClientSecret: '',
  oidcIssuerURI: 'https://authentification-candidat.pole-emploi.fr:443/connexion/oauth2/realms/root/realms/individu',
  oidcJwksURI: 'https://authentification-candidat.pole-emploi.fr/connexion/oauth2/connect/jwk_uri?realm=%2Findividu',
  oidcRedirectURI: 'http://localhost:8080/',
  oidcSCOPE: 'application_PAR_estime_92ac2bd6cc903ee96ac415bab999d13d29a0c1d71de408dc9246162ba99b002d api_peconnect-individuv1 openid profile email',
  oidcSTSAutority: 'https://authentification-candidat.pole-emploi.fr/connexion/oauth2/',
  oidcUserInfoURI: 'https://api.emploi-store.fr/partenaire/peconnect-individu/v1/userinfo'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
