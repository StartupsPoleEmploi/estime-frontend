![logo Estime](.gitlab/images/logo_estime_v2.png)

:fr: [French version](https://github.com/StartupsPoleEmploi/estime-frontend/blob/2580116d55c2b9dfbb1ba380a769a186293b1d02/README.md)

# [Pôle emploi Startup] Estime

### **The idea :**

Offer a simulator to encourage an unemployed person to take back a job in giving him a visualization on 6 months of all its futures financial resources (Pôle emploi benefits, CAF benefits) when he takes back a job. More informations on [https://beta.gouv.fr/startups/estime.html](https://beta.gouv.fr/startups/estime.html)

Access to the application : [https://estime.pole-emploi.fr/](https://estime.pole-emploi.fr/)

# [Software Architecture] Simplified diagram 

![Estime Software Architecture](.gitlab/images/schema_architecure_v3.png)

- [Github - Springboot REST application](https://github.com/StartupsPoleEmploi/estime-backend)  
- [Github - Openfisca REST application](https://github.com/StartupsPoleEmploi/openfisca-france).


:closed_lock_with_key: The access to the Estime service is secured by an authentification with [Pôle emploi Connect](https://www.emploi-store-dev.fr/portail-developpeur/detailapicatalogue/-se-connecter-avec-p-le-emploi-v1?id=58d00957243a5f7809e17698).

# [Source Code] Some explanations

This project is realized in [Typescript](https://www.typescriptlang.org/docs) with [Angular framework](https://angular.io/docs).


This project has been generated with [the Angular CLI](https://cli.angular.io/) and use [npm](https://www.npmjs.com/) to manage its dependencies.

## Source code structuration

- **./src/app/public :** public components, reachable not logged in (homepage, cgu, etc...).
- **./src/app/protected :** protected components, reachable only logged in (simulation steps, etc.).
- **./src/app/commun :** common components, directives, guards, pipes, models
- **./src/app/core :** singleton services 
- **./docker :** Docker configuration files
- **./cypress :** e2e tests 

## HTML and CSS librairies

- [Bootstrap 4](https://getbootstrap.com/docs/4.1/components/alerts/) 
- [ngx-bootstrap.](https://valor-software.com/ngx-bootstrap/#/documentation).
- [Saas](https://sass-lang.com/guide), Syntactically Awesome Style Sheets.

## Manage dependencies with npm

NPM is used to manage the dependencies of this project. To control the updating, this project doesn't use ~ or ^ in package.json. Dependancy versions are updated manually. 

:wrench: Tools to help :

- [npm-check ](https://www.npmjs.com/package/npm-check)
- [npm-audi](https://docs.npmjs.com/cli/v6/commands/npm-audit)


# [Local development] Launch the application on localhost

## Prerequisites

Install NodeJS with **minimal version 12.11.x**. 

:thumbsup: Install [NodeJS](https://nodejs.org/en/) with a tool like nvm to manage several versions easily. More informations by [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm).

Check your installation :

```console
foo@bar:~$ node -v
foo@bar:~$ npm -v
```

## Steps to follow

1. Install Angular CLI 

   ```console
   foo@bar:~$ npm install -g @angular/cli
   ```

1. Clone the project

   ```console
   foo@bar:~$ git clone https://git.beta.pole-emploi.fr/estime/estime-frontend.git
   ```
1. Open the project with your favorite IDE

   :thumbsup: [VS Code](#ide-vs-code) is a free IDE, light and it allows you to have an excellent comfort to develope Angular applications.

1. Install dependencies

   ```console
   foo@bar:~estime-frontend$ npm install
   ```
1. Create a file named ***environment.local.ts*** in **estime-frontend/src/environments** 

   - Copy the next lines and replace variables **%% à renseigner %%** 
   - For the **apiEstimeURL** parameter, consult [Springboot REST Application](#api-estime-backend-appeler-lapi-coeur-metier-estime) section
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

1. Launch the application  :

   ```console
   foo@bar:~estime-frontend$ npm start
   ```

# [Springboot REST Application] Install the application in local environment

  1. Follow the **[README](https://github.com/StartupsPoleEmploi/estime-backend)**  of the project
  1. Replace apiEstimeURL parameter in environment.local.ts file :

     ```
     export const environment = {
     production: false,
     /******** url de l'api coeur métier Estime ************/
     apiEstimeURL: 'http://localhost:8081/estime/v1/',
     [...]
     };
     ```

# [e2e Tests] Cypress

## Tests structuration

**We use the "Page Object" pattern**.

- **./cypress/integration/integration :** classes implementing the logical of tests
- **./cypress/integration-commun :** Page Object classes
- **./ci :** configuration files to execute tests in GitLab CI pipeline
- **coverage.webpack.js :**  coverage report with [istanbul-lib-instrument] (https://github.com/webpack-contrib/istanbul-instrumenter-loader) library

## Execute e2e tests in local environment

1. Create an environment.ts file to in cypress root directory

   Copy the next lines with replacing variables %% à renseigner %% :

   ```
   export const environment = {
      urlApplication: '%% à renseigner %%',
      peConnectUserIdentifiant: '%% à renseigner %%',
      peConnectUserMotDePasse: '%% à renseigner %%''
   };
   ```

1. Launch Cypress :

   ```console
   foo@bar:~estime-frontend$ npm cy:open
   ```

# [Containerization] use Docker

- **./docker/local** : configuration files to launch the application in local environment with Docker Compose
- **./docker/recette** : configuration files for staging environment and a deployment on a Docker Swarm server
- **./docker/production** : configuration files for production environment and a deployment on a Docker Swarm server
- **./docker/commun** : common configuration files (nginx, fail2ban, scripts shell)

## Launch the application in local environment with Docker Compose

**Prerequisites :** install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/).

1. Launch application build :

   ```
   foo@bar:~estime-frontend$ npm run build:dev
   ```
1. Launch Docker image build :

   ```
   foo@bar:~estime-frontend$ docker build . -f ./docker/local/docker-image/Dockerfile  -t estime-frontend
   ```

1. Create a docker-compose.yml file, don't forget to replace variables **%% à renseigner %%** 
   
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
1. Go to your docker-compose file directory and run the container : 

   ```shell
   foo@bar:~docker-compose-directory$ docker-compose up -d
   ```

1. The application should be accessible on http://localhost:3000

# [CI/CD] build and automated deployment with Gitlab CI

See **gitlab-ci.yml** file.

# [Code Quality] Follow the quality of the source code

Dashboard with Sonarqube : [https://sonarqube.beta.pole-emploi.fr/dashboard?id=estime-frontend](https://sonarqube.beta.pole-emploi.fr/dashboard?id=estime-frontend)

# [Server Environment] How to manage the application on a Docker Swarm server ?

- Check application status :

   ```
   foo@bar:~$ docker container ls | grep estime-frontend
   ```
   
   Containers must be in status **UP** and **healthy**.

- Watch logs :

   ```
   foo@bar:~$ docker service logs estime-frontend_estime-frontend
   ```

- Start or restart the service

   - Go to **/home/docker/estime-frontend** directory
   - Execute the next command :

      ```
      foo@bar:/home/docker/estime-frontend$ docker stack deploy --with-registry-auth -c estime-frontend-stack.yml estime-frontend 
      ```

- Stop the service :

   ```
   foo@bar:~$ docker stack rm estime-frontend
   ```

## Zero Downtime Deployment

The Docker service is configured to get zero downtime during deployment. 

```
healthcheck:
   test: curl -v --silent http://localhost:8080/estime/v1/actuator/health 2>&1 | grep UP || exit 1
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

This configuration allows to replicate the service with 2 replicas. When a restart coming, a service will be considered operationnal if healthcheck test succeeded. If a restart comming, Docker restart one service and when this first service is operationnal (healthy status), Docker updates the second service.

## CPU and memory reservations

To control server resources, limitations on CPU and memory usage have been configured :

```
resources:
   reservations:
      cpus: '0.20'
      memory: 512Mi
   limits:
      cpus: '0.40'
      memory: 1536Mi
```

To see CPU and memory used by Docker containers, execute this command :
```
foo@bar:~$ docker stats
```

## How to know the version of the deployed application ?

You just have to access to [https://estime.pole-emploi.fr/version.json](https://estime.pole-emploi.fr/version.json)

# [IDE] VS Code

VS Code is available on [the official site](https://code.visualstudio.com/) 

:wrench:  Some useful plugins :

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
