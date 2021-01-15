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


# [Développement en local] Lancement de l'application Web Angular sur localhost

Ce projet a été généré avec [Angular CLI](https://cli.angular.io/) et utilise [npm](https://www.npmjs.com/) pour gérer les dépendances externes.

## Prérequis

Installation de NodeJS avec une **version 12.11.x minimum**. 

:thumbsup: installer [NodeJS](https://nodejs.org/en/) avec un outil permettant de gérer plusieurs versions de Node (exemple : nvm). Plus d'informations, par [ici](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm).

**Vérifier votre installation** :

```
node -v
npm -v
```


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Docker 

docker build -f ./docker/local/docker-image/Dockerfile . -t estime-frontend

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Cypress localhost cors 
"chromeWebSecurity": false

## Stats

npm runs stats
https://www.npmjs.com/package/webpack-bundle-analyzer
