![alt text](.gitlab/images/logo_estime_v2.png)

# [Startups d'Etat Pôle emploi] Estime - simulateur d'aides à la reprise d'emploi

La startup Estime est issue du challenge intraprenarial 2020 de Pôle emploi. 

**L’idée :**

Proposer un simulateur qui permet aux demandeurs d’emploi de visualiser, sur une période de 6 mois, toutes leurs futures ressources en cas de reprise d’emploi, de formation ou de création d’entreprise. 

[Fiche startup sur beta.gouv - Incubateur de services publics numériques](https://beta.gouv.fr/startups/estime.html)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.3.

# [Architecture] 


# Lancelement de l'application Angular en local

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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
