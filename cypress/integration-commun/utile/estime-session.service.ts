import { Individu } from '../../../src/app/commun/models/individu'

class EstimeSessionService {

  public clearEstimeSession(): void {
    this.supprimerSessionPeConnect();
    cy.window().then(window => window.sessionStorage.clear());
  }


  private supprimerSessionPeConnect(): void {
    const individu = this.getIndividuConnected();
    if(individu !== null) {
      const poleEmploiIdentityServerDeconnexionURI = this.getPoleEmploiIdentityServerDeconnexionURI(individu);
      document.location.replace(poleEmploiIdentityServerDeconnexionURI);
      cy.wait(3000);
    }
  }

  private getIndividuConnected(): Individu {
    let individu = null;
    if(document && document.cookie) {
      let cookieValue: any = document.cookie.split('; ').find(row => row.startsWith('estime.peConnectIndividu')).split('=')[1];
      individu = JSON.parse(this.replaceAsciiByCHaractere(cookieValue));
    }
    return individu;
  }

  private replaceAsciiByCHaractere(cookieValue: any) {
    cookieValue = cookieValue.replaceAll('%7B', '{');
    cookieValue = cookieValue.replaceAll('%22', '"');
    cookieValue = cookieValue.replaceAll('%7D', '}');
    cookieValue = cookieValue.replaceAll('%3A', ':');
    cookieValue = cookieValue.replaceAll('%2C', ',');
    return cookieValue;
  }

  private getPoleEmploiIdentityServerDeconnexionURI(individuConnected: Individu): string {
    return `https://authentification-candidat.pole-emploi.fr/compte/deconnexion?` +
        `&id_token_hint=${individuConnected.peConnectAuthorization.idToken}` +
        `&redirect_uri=http://localhost.estime:9001/signout-callback`
  }
}
export default EstimeSessionService