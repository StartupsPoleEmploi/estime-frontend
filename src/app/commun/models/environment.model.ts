export class Environment {
  readonly production: boolean;
  readonly apiEstimeURL: string;
  readonly oidcClientId: string;
  readonly oidcClientSecret: string;
  readonly oidcIssuerURI: string;
  readonly oidcJwksURI: string;
  readonly oidcRedirectURI: string;
  readonly oidcSCOPE: string;
  readonly oidcSTSAutority: string;
  readonly oidcUserInfoURI: string;
}
