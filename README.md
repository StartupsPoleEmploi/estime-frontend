![logo Estime](.gitlab/images/logo_estime_v2.png)

# [Startups d'Etat Pôle emploi] Estime - simulateur d'aides à la reprise d'emploi

La startup d'Etat _Estime_ est issue du challenge intraprenarial 2020 de Pôle emploi. 

### **L’idée :**

Proposer un simulateur qui permet aux demandeurs d’emploi de visualiser, sur une période de n mois, toutes leurs futures ressources financières en cas de reprise d’emploi (aides Pôle emploi, aides CNAF). Plus d'informations sur la [fiche startup de beta.gouv (Incubateur de services publics numériques)](https://beta.gouv.fr/startups/estime.html)

# [Architecture] Schéma simplifié de l'application Estime

![schéma architecure Estime](.gitlab/images/schema_architecure_v1.png)


L'application est composée de 3 composants applicatifs :

- frontend : application Web développée en Angular (Typescript) - ce projet Gitlab contient les sources de l'application Web
- backend coeur métier : api REST développée en Springboot (Java) - [lien projet Gitlab de l'api](https://git.beta.pole-emploi.fr/estime/estime-backend).
- backend moteur de calcul : api REST Openfisca développée en Python - [lien projet Gitlab de l'api](https://git.beta.pole-emploi.fr/estime/openfisca-france).


:closed_lock_with_key: L'accès au service Estime est **sécurisé par une authentification avec [PE Connect](https://peconnect.pole-emploi.fr/).**

# [Code Source] Quelques explications

Ce projet est développé en utilisant le langage [Typescript](https://www.typescriptlang.org/docs) et le framework [Angular](https://angular.io/docs).

Ce projet a été généré avec [Angular CLI](https://cli.angular.io/) et utilise [npm](https://www.npmjs.com/) pour gérer les dépendances externes.

## Structuration du code source

- **./src/app/public :** : contient les components de type application qui sont publics, accessibles en non authentifié (homepage, cgu, etc...).
- **./src/app/protected :** : contient les components de type application qui sont privés, accessibles en authentifié (étapes de la simulation, etc...).
- **./src/app/commun :** répertoire contenant les components "communs" et partagés avec tous les components App (ex : component loading, component header, component footer, directives, guards, pipes, models, etc...
- **./src/app/core :** répertoire contenant les services communs qui sont de type Singleton (une seul instance).
- **./docker :** contient les configurations Docker utilisées pour le déploiement sur les serveurs distants, voir section [Déploiement de l'application](#ci-cd-build-et-déploiement-automatisés-avec-gitlab-cicd)
- **./cypress :** contient les tests e2e, voir section [Tests e2e](##tests-e2e-cypress)

## Design du site

- Utilisation de la librairie [Bootstrap4](https://getbootstrap.com/docs/4.1/components/alerts/) et de la la librairie [ngx-bootstrap.](https://valor-software.com/ngx-bootstrap/#/documentation).
- Utilisation de [Saas](https://sass-lang.com/guide), préprocesseur de CSS.

## Gestion des dépendances

Pas de mise à jour automatique des versions des librairies (~version ou ^version), il faut mettre à jour les versions manuellement. 

:wrench:  Outils pour aider à la mise à jour des librairies :

- [npm-check ](https://www.npmjs.com/package/npm-check)
- [npm-audi](https://docs.npmjs.com/cli/v6/commands/npm-audit)


# [Développement en local] Lancement de l'application Web Angular sur localhost

## Prérequis

Installation de NodeJS avec une **version 12.11.x minimum**. 

:thumbsup: Installer [NodeJS](https://nodejs.org/en/) avec un outil permettant de gérer plusieurs versions de Node (exemple : nvm). Plus d'informations, par [ici](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm).

Vérifier votre installation :

```console
foo@bar:~$ node -v
foo@bar:~$ npm -v
```

## Les étapes à suivre

1. Installer Angular CLI 

   ```console
   foo@bar:~$ npm install -g @angular/cli
   ```

1. Cloner le projet Gitlab **estime-frontend**

   ```console
   foo@bar:~$ git clone https://git.beta.pole-emploi.fr/estime/estime-frontend.git
   ```
1. Ouvrir le projet **estime-frontend** via votre IDE préféré

   :thumbsup: [VS Code](#ide-vs-code) est un IDE gratuit, légé et qui permet d'avoir un excellent confort de développement avec Angular

1. Installer les dépendances du projet

   ```console
   foo@bar:~estime-frontend$ npm install
   ```
1. Créer le fichier d'environnement local

   - Créer un fichier nommé ***environment.local.ts*** dans **estime-frontend/src/environments** 
      
      :exclamation: Ce fichier pouvant contenir des informations sensibles ne doit pas être poussé dans le repository distant (fichier  présent dans .gitignore).

   - Copier le contenu suivant et valoriser les paramètres  :
   
   ```typescript
   export const environment = {
      production: false,
      /******** url de l'api coeur métier Estime ************/
      apiEstimeURL: '%% à renseigner %%',
      /******** OpenID Connect PE properties ************/
      peconnectClientid: '%% à renseigner %%',
      peconnectRedirecturi: 'http://localhost:4200/',
      peconnectScope: '%% à renseigner %%',
      peconnectIdentityServerURL: 'https://authentification-candidat.pole-emploi.fr',
      /******** url du script TagCommander (activation du taggage et du consentement Cookies)  ************/
      tagCommanderScriptUrl: ''
   };
   ```
   - **apiEstimeURL** : consulter la section [Appeler l'api coeur metier Estime](#appeler-lapi-coeur-metier-estime)
   - **OpenID Connect PE properties** : ces informations peuvent être récupérées en se connectant au compte Estime de l'[Emploi Store    
     Dev de Pôle emploi](https://www.emploi-store-dev.fr/portail-developpeur-cms/home.html;JSESSIONID_JAHIA=FE12476DF0564E5EE4269FD4FB9016E0).
   - **tagCommanderScriptUrl** : non renseigné car le taggage et le consentement Cookies n'est pas activé en localhost 
   <br />
1. Lancer l'application en exécutant la commande suivante :

   ```console
   foo@bar:~estime-frontend$ npm start
   ```


### Appeler l'api coeur metier Estime

Plusieurs possibilités :

- installer en local l'api

  1. suivre les instructions du **[README du projet Gitlab estime-backend](https://git.beta.pole-emploi.fr/estime/estime-backend)**
  1. renseigner le paramètre apiEstimeURL du fichier environment.local.ts comme ci-dessous :

     ```typescript
     export const environment = {
     production: false,
     /******** url de l'api coeur métier Estime ************/
     apiEstimeURL: 'http://localhost:8081/estime/v1/',
     [...]
     };
     ```
- se brancher sur l'api déployée sur l'environnement de recette

   Renseigner le paramètre apiEstimeURL du fichier environment.local.ts comme ci-dessous :

   ```typescript
   export const environment = {
      production: false,
      /******** url de l'api coeur métier Estime ************/
      apiEstimeURL: 'https://estime.beta.pole-emploi.fr/estime/v1/',
      [...]
   };
   ```

# [Tests e2e] Cypress

## Structuration des tests

**Utilisation du pattern "Page Object"** avec une page représentée par une classe.

- **./cypress/integration/integration :** contient les classes implémentant la logique des tests. Organisation par features et user stories
- **./cypress/integration-commun/pages :** contient les classes représentant les pages
- **./cypress/integration-commun/sections  :** contient les classes représentant des sections communes à plusieurs pages. Exemple : le header, le footer)
- **./ci :** fichiers de configuration nécessaires à l'exécution des tests dans le pipeline de CI/CD
- **coverage.webpack.js :** utilisation de la librairie [istanbul-lib-instrument ](https://github.com/webpack-contrib/istanbul-instrumenter-loader) pour remonter une couverture de code par les tests e2e

## Executer les tests e2e en local

1. Créer un fichier environment.ts à la racine du répertoire cypress. 

   :exclamation: Ce fichier pouvant contenir des informations sensibles ne doit pas être poussé dans le repository distant (fichier  présent dans .gitignore).

   Copier le contenu suivant et valoriser les paramètres  :

   ```
   export const environment = {
      urlApplication: '%% à renseigner %%',
      peConnectUserIdentifiant: '%% à renseigner %%',
      peConnectUserMotDePasse: '%% à renseigner %%''
   };
   ```

1. Exécuter la commande suivante pour démarrer Cypress et lancer les tests :

   ```console
   foo@bar:~estime-frontend$ npm cy:open
   ```

# [CI/CD] build et déploiement automatisés avec Gitlab CI/CD

# [Qualimétrie] Suivi de la qualité du code source

# [IDE] VS Code

VS Code est disponible en téléchargement sur le [site officiel](https://code.visualstudio.com/) 

:wrench:  Quelques extensions utiles que vous pourver installer dans votre IDE :

- Angular Language Service
- Angular Schematics
- Angular Snippets (Version 11)
- Angular template formatter
- HTMLHint
- HTML class snippets with Bootstrap4
- Bootstrap v4 Snippets
- SCSS Formatter
- TypeScript Hero
- vsc-organize-imports
- ESLint








