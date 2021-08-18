![logo Estime](.gitlab/images/logo_estime_v2.png)

:gb: [English version](https://github.com/StartupsPoleEmploi/estime-frontend/blob/cf573e1dade0b00522393374214e4be5bf36bc55/README_EN.md)

# [Startup Pôle emploi] Estime - simulateur d'aides à la reprise d'emploi

### **L’idée :**

Proposer un simulateur qui encourage l'acte de reprise à l'emploi d'un demandeur d’emploi en lui offrant la possibilié de visualiser, sur une période de 6 mois, toutes ses futures ressources financières en cas de reprise d’emploi (aides Pôle emploi, aides CNAF). Plus d'informations sur notre démarche [https://beta.gouv.fr/startups/estime.html](https://beta.gouv.fr/startups/estime.html)

Accéder à l'application : [https://estime.pole-emploi.fr/](https://estime.pole-emploi.fr/)

# [Architecture] Schéma simplifié

![schéma architecure Estime](.gitlab/images/schema_architecure_v3.png)

- [Github application REST Springboot](https://github.com/StartupsPoleEmploi/estime-backend)  
- [Github application REST Openfisca](https://github.com/StartupsPoleEmploi/openfisca-france).


:closed_lock_with_key: L'accès au service Estime est **sécurisé par une authentification avec [Pôle emploi Connect](https://www.emploi-store-dev.fr/portail-developpeur/detailapicatalogue/-se-connecter-avec-p-le-emploi-v1?id=58d00957243a5f7809e17698).**

# [Code Source] Quelques explications

Ce projet est développé en [Typescript](https://www.typescriptlang.org/docs) avec le framework [Angular](https://angular.io/docs).

Ce projet a été généré avec [Angular CLI](https://cli.angular.io/) et utilise [npm](https://www.npmjs.com/) pour gérer les dépendances externes.

## Structuration du code source

- **./src/app/public :** composants publics, accessibles en non authentifié (homepage, cgu, etc...).
- **./src/app/protected :** composants protégés, accessibles seulement authentifié (étapes de la simulation, etc...).
- **./src/app/commun :** composants communs, directives, guards, pipes, models
- **./src/app/core :** services singleton
- **./docker :** fichier de configuration Docker
- **./cypress :** tests e2e

## librairies HTML et CSS

- [Bootstrap 4](https://getbootstrap.com/docs/4.1/components/alerts/) 
- [ngx-bootstrap.](https://valor-software.com/ngx-bootstrap/#/documentation).
- [Scss](https://sass-lang.com/guide), préprocesseur de CSS.

## Gestion des dépendances avec npm

Les mises à jour des dépendances du projet se font avec npm. Pour contrôler la mise à jour des versions, pas d'utilisation de ~  ou ^ dans le package.json, les versions sont mise à jour manuellement. 

:wrench:  Outils utiles :

- [npm-check ](https://www.npmjs.com/package/npm-check)
- [npm-audi](https://docs.npmjs.com/cli/v6/commands/npm-audit)


# [Développement en local] Lancer l'application sur localhost

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

1. Cloner le projet avec git

1. Ouvrir le projet via votre IDE préféré

   :thumbsup: [VS Code](https://code.visualstudio.com/) est un IDE gratuit, légé et qui permet d'avoir un excellent confort de développement sur Angular

1. Installer les dépendances du projet

   ```console
   foo@bar:~estime-frontend$ npm install
   ```
1. Créer un fichier nommé ***environment.local.ts*** dans **estime-frontend/src/environments** 

   - Copier le contenu suivant et remplacer les variables **%% à renseigner %%** 
   - Pour le paramètre **apiEstimeURL**, consulter la section [Application Springboot](#application-rest-springboot-installer-lapplication-en-local) 
   <br />
   
   ```
   export const environment = {
      production: false,
      /******** url de l'api coeur métier Estime ************/
      apiEstimeURL: '%% à renseigner %%',
      /******** OpenID Connect PE properties ************/
      peconnectClientid: '%% à renseigner %%',
      peconnectRedirecturi: 'http://localhost:9001/',
      peconnectScope: '%% à renseigner %%',
      peconnectIdentityServerURL: 'https://authentification-candidat.pole-emploi.fr',
      /******** url du script TagCommander (activation du taggage et du consentement Cookies)  ************/
      /** non renseigné car le taggage et le consentement Cookies n'est pas activé en localhost          **/
      tagCommanderScriptUrl: ''
   };
   ```

1. Démarrer l'application :

   ```console
   foo@bar:~estime-frontend$ npm start
   ```

# [Application REST Springboot] Installer l'application en local

  1. suivre les instructions du **[README du projet](https://github.com/StartupsPoleEmploi/estime-backend)**
  1. renseigner le paramètre apiEstimeURL du fichier environment.local.ts comme ci-dessous :

     ```
     export const environment = {
     production: false,
     /******** url de l'api coeur métier Estime ************/
     apiEstimeURL: 'http://localhost:8081/estime/v1/',
     [...]
     };
     ```

# [Tests e2e] Cypress

## Structuration des tests

**Utilisation du pattern "Page Object"**.

- **./cypress/integration/integration :** classes implémentant la logique des tests. Organisation par features et user stories
- **./cypress/integration-commun :** classes Page Object
- **./ci :** fichiers de configuration pour l'exécution des tests dans le pipeline de GitLab CI
- **coverage.webpack.js :**  rapport de couverture du code avec [istanbul-lib-instrument ](https://github.com/webpack-contrib/istanbul-instrumenter-loader)

## Executer les tests e2e en local

1. Créer un fichier environment.ts à la racine du répertoire cypress

   Copier le contenu suivant en valorisant les paramètres  :

   ```
   export const environment = {
      urlApplication: '%% à renseigner %%',
      peConnectUserIdentifiant: '%% à renseigner %%',
      peConnectUserMotDePasse: '%% à renseigner %%''
   };
   ```

1. Lancer Cypress :

   ```console
   foo@bar:~estime-frontend$ npm cy:open
   ```

# [Conteneurisation] Utilisation de Docker

- **./docker/local** : fichiers de configuration pour lancer l'application en local avec Docker Compose
- **./docker/recette** : fichiers de configuration pour l'environnement de recette et un déploiement sur un serveur Docker Swarm
- **./docker/production** : fichiers de configuration pour l'environnement de production et un déploiement sur un serveur Docker Swarm
- **./docker/commun** : fichiers de configuration communs (nginx, fail2ban, scripts shell)

## Lancer l'application en local avec Docker Compose

**Prérequis :** installer [Docker](https://docs.docker.com/engine/install/) et [Docker Compose](https://docs.docker.com/compose/install/).

1. Lancer le build de l'application :

   ```
   foo@bar:~estime-frontend$ npm run build:dev
   ```
1. Lancer le build de l'image Docker :

   ```
   foo@bar:~estime-frontend$ docker build . -f ./docker/local/docker-image/Dockerfile  -t estime-frontend
   ```

1. Créer un fichier docker-compose.yml, n'oubliez pas de valoriser les **%% à renseigner %%** 
   
   ```
   version: '3.8'

   services:
      estime-frontend:
         image: estime-frontend
         ports:
            - 3000:8888
         environment:
            PE_CONNECT_CLIENT_ID: "%% à renseigner %%"
            PE_CONNECT_REDIRECT_URI: "%% à renseigner %%"
            PE_CONNECT_SCOPE: "%% à renseigner %%"
            PE_CONNECT_IDENTITY_SERVER_URL: "%% à renseigner %%"
            TAG_COMMANDER_SCRIPT_URL: ""
            TZ: "Europe/Paris"
   ```
1. Se positionner dans le répertoire de votre fichier docker-compose.yml et démarrer le conteneur : 

   ```shell
   foo@bar:~docker-compose-directory$ docker-compose up -d
   ```

1. L'application devrait être accessible sur http://localhost:3000

# [CI/CD] build et déploiement automatisés avec Gitlab CI

Voir le fichier **./.gitlab-ci.yml**

# [Qualimétrie] Suivi de la qualité du code source

Tableau de bord sous Sonarqube : [https://sonarqube.beta.pole-emploi.fr/dashboard?id=estime-frontend](https://sonarqube.beta.pole-emploi.fr/dashboard?id=estime-frontend)

# [Suivi opérationnel] Comment dépanner l'application sur un serveur Docker Swarm ?

- Vérifier que l'application fonctionne correctement :

   ```
   foo@bar:~$ docker container ls | grep estime-frontend
   ```
   
   Les conteneurs doivent être au statut **UP** et **healthy**.

- Consulter les logs :

   ```
   foo@bar:~$ docker service logs estime-frontend_estime-frontend
   ```

- Démarrer ou relancer le service

   - Se positionner dans le répertoire **/home/docker/estime-frontend**
   - Exécuter la commande suivante :

      ```
      foo@bar:/home/docker/estime-frontend$ docker stack deploy --with-registry-auth -c estime-frontend-stack.yml estime-frontend 
      ```

- Stopper le service :

   ```
   foo@bar:~$ docker stack rm estime-frontend
   ```

## Zero Downtime Deployment

Le service Docker a été configuré afin d'éviter un temps de coupure du service au redémarrage de l'application. 

```
healthcheck:
   test: curl --fail http://localhost:8888/ || exit 1
   timeout: 30s
   interval: 1m
   retries: 10
   start_period: 180s
deploy:
   replicas: 2
   update_config:
      parallelism: 1
      order: start-first
      failure_action: rollback
      delay: 10s
   rollback_config:
      parallelism: 0
      order: stop-first
   restart_policy:
      condition: any
      delay: 5s
      max_attempts: 3
      window: 180s
```

Cette configuration permet une réplication du service avec 2 replicas. Lors d'un redémarrage, un service sera considéré opérationnel que si le test du healthcheck a réussi. Si un redémarrage est lancé, Docker va mettre à jour un premier service et s'assurer que le conteneur soit au statut healthy avant de mettre à jour le second service.

## Limitation des ressources CPU et RAM

Afin de gérer au mieux les ressources du serveur, la quantité de ressources CPU et de mémoire que peut utliser un conteneur a été limitée :

```
resources:
   reser vations:
      cpus: '0.15'
      memory: 128Mi
   limits:
      cpus: '0.30'
      memory: 256Mi
```

Voir la consommation CPU et mémoire des conteneurs Docker :
```
foo@bar:~$ docker stats
```

## Connaître la version de l'application déployée

Accéder à la version via [https://estime.pole-emploi.fr/version.json](https://estime.pole-emploi.fr/version.json)

# [npm] Scripts utiles

Lancer un script :
```
foo@bar:~estime-frontend$ npm run **nom_script**
```
|        Nom            |                     Description                           |
|-----------------------|-----------------------------------------------------------|
| build:dev             | build l'application avec le profil dev                    |
| build:prod            | build l'application avec le profil prod                   |
| cy:open               | lance l'utilitaire Cypress Test Runner                    |
| cy:run                | lance les tests Cypress                                   |
| start                 | lance l'application dans le navigateur sur localhost:9001 |
| start:ngx             | lance l'application sur localhost:9001 avec ngx-build-plus, utile pour remonter une couverture de code par les tests Cypress |
| stats:size            | génération d'un rapport sur la taille du bundle ([webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)) |

# [Livraison] Livrer une nouvelle version en production

Une image Docker Nginx contenant le code source de l'application Angular est livrée sur les différents environnements (recette, production). Cette image est versionnée en **release-candidate pour la recette** et en **release pour la production**.

## Procédure de build et de livraison d'une version release en production

Après s'être assuré du bon fonctionnement de l'application sur l'environnement de recette, voici les étapes à suivre pour livrer la version de l'application de recette en production.

### La veille de la mise en prodction

* mettre à jour les informations de version du fichier ***src/version.json*** et la version du fichier ***package.json***. Possibilité de vérifier la version actuelle en production via [https://estime.pole-emploi.fr/version.json](https://estime.pole-emploi.fr/version.json).

* commit les changements et livrer en recette (exemple message commit : "création version production v1.5.0").

* une fois la livraison en recette effectuée, lancer dans le pipeline GitLab CI, les jobs **build-docker-image-production** et **generate-docker-stack-production**

* poser un tag via GitLab dans **Repository => Tags** (exemple nommage du tag : v1.5.0-version-mise-en-prod)

### Mise en production le lendemain

* lancer le job **deploy_application_production**

* se connecter sur la machine pour vérifier que tout se passe bien, voir section [Suivi opérationnel](#suivi-opérationnel-comment-dépanner-lapplication-sur-un-serveur-docker-swarm-)

*  envoyer une notification à l'équipe


# [VS Code] Quelques plugins utiles

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

# [CLI] Liste des commandes

|        Commande    |               Description                   |
|--------------------|---------------------------------------------|
|npm start           |Démarrer l'application sur localhost         |
|npm run build:prod  |Build l'application environnement production |
|npm run start:ngx   |Lancer l'application avec ngx pour remonter couverture code par les tests Cypress|
|npm run cy:open     |Lancer Cypress Test Runner                   |
|npm run cy:run      |Lancer les tests Cypress                     |
|npx browserlist     |Lister versions des navigateurs compatibles  | 
|npm run stats:size  |Lancer l'analyse de la taille du bundle      |






