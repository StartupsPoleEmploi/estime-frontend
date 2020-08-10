export class AccessTokenInfo {

  accessToken: string;
  expireIn: number;
  idToken: string;
  refreshToken: string;
  scope: string;
  tokenType: string;

  constructor(
    accessToken: string,
    expireIn: number,
    idToken: string,
    refreshToken: string,
    scope: string,
    tokenType: string
  ) {
    this.accessToken = accessToken;
    this.expireIn = expireIn;
    this.idToken = idToken;
    this.refreshToken = refreshToken;
    this.scope = scope;
    this.tokenType = tokenType;
  }
}