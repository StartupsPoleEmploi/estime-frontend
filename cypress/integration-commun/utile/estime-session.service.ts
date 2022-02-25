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
    console.log(document.cookie.split('; '));
    if (document && document.cookie) {
      console.log(document.cookie.split('; '));
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
      `&redirect_uri=${environment.urlApplication}/signout-callback`
  }
}
export default EstimeSessionService