export class InformationAutorisationOIDC {

  clientId: string;
  code: string;
  nonce: string;
  redirectURI: string;
  state: string;

  constructor(
    clientId: string,
    code: string,
    nonce: string,
    redirectURI: string,
    state: string
  ) {
    this.clientId = clientId;
    this.code = code;
    this.nonce = nonce;
    this.redirectURI = redirectURI;
    this.state = state;
  }
}
