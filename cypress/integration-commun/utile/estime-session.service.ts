import { Individu } from '../../../src/app/commun/models/individu'
import { environment } from '../../environment'

class EstimeSessionService {

  public clearEstimeSession(): void {
    this.supprimerSessionPeConnect();
    cy.window().then(window => window.sessionStorage.clear());
  }

  private supprimerSessionPeConnect(): void {
    const individu = this.getIndividuConnected();
    if (individu !== null) {
      const poleEmploiIdentityServerDeconnexionURI = this.getPoleEmploiIdentityServerDeconnexionURI(individu);
      document.location.replace(poleEmploiIdentityServerDeconnexionURI);
      cy.wait(3000);
    }
  }

  private getIndividuConnected(): Individu {
    let individu = null;
    if (document && document.cookie) {
      let cookieValue: any = document.cookie.split('; ').find(row => row.startsWith('estime.peConnectIndividu'));
      if (cookieValue) {
        cookieValue = cookieValue.split('=')[1];
        individu = JSON.parse(this.replaceAsciiCharacter(cookieValue));
      }
    }
    return individu;
  }

  private replaceAsciiCharacter(cookieValue: any) {
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
      `&redirect_uri=${environment.urlApplication}/signout-callback`
  }
}
export default EstimeSessionService