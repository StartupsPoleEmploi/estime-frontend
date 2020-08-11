export const environment = {
  production: true,
  apiEstimeURL: '/estime/v1/',
  /** OpenID Connect PE properties ***/
  oidcClientId: 'PAR_estime_92ac2bd6cc903ee96ac415bab999d13d29a0c1d71de408dc9246162ba99b002d',
  oidcRedirectURI: 'https://estime.beta.pole-emploi.fr/',
  oidcScope: 'application_PAR_estime_92ac2bd6cc903ee96ac415bab999d13d29a0c1d71de408dc9246162ba99b002d api_peconnect-individuv1 openid profile email api_peconnect-detailindemnisationsv1 detailindemnisation',
  oidcPoleEmploiIdentityServerURL: 'https://authentification-candidat.pole-emploi.fr'
};
