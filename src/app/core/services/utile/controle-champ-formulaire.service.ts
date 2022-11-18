import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ControleChampFormulaireService {

  REGEX_DECIMAL = "^[0-9]{1,5}((\.|\,)[0-9]{1,2})?$";
  REGEX_NUMERIC = "^[0-9]{1,6}$";
  REGEX_EMAIL = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
  MESSAGE_CHAMP_OBLIGATOIRE = "Ce champ est obligatoire";
  MESSAGE_CHAMP_OBLIGATOIRE_ASTERIX = "Tous les champs marqués d'un astérisque (*) sont obligatoires";
  MESSAGE_CODE_POSTAL_INCORRECT = "Le code postal est incorrect";
  MESSAGE_DATE_ANNEE_OBLIGATOIRE = "L'année est obligatoire";
  MESSAGE_DATE_JOUR_OBLIGATOIRE = "Le jour est obligatoire";
  MESSAGE_DATE_MOIS_OBLIGATOIRE = "Le mois est obligatoire";
  MESSAGE_DATE_JOUR_ANNEE_OBLIGATOIRES = "Le jour et l'année sont obligatoires";
  MESSAGE_DATE_JOUR_MOIS_OBLIGATOIRES = "Le jour et le mois sont obligatoires";
  MESSAGE_DATE_MOIS_ANNEE_OBLIGATOIRES = "Le mois et l'année sont obligatoires";
  MESSAGE_DATE_JOUR_MOIS_ANNEE_OBLIGATOIRES = "Le jour, le mois et l'année sont obligatoires";
  MESSAGE_DUREE_HEBDO_INCORRECTE = "La durée hebdomadaire renseignée est incorrecte";
  MESSAGE_MONTANT_ERREUR = "Le montant doit être un nombre avec 2 décimales maximum séparées par une virgule (exemple : 900,49)";
  MESSAGE_MONTANT_ERREUR_2 = "Le montant doit être un nombre avec 2 décimales maximum séparées par une virgule (exemple : 16,89)";
  MESSAGE_MONTANT_ERREUR_ENTIER = "Le montant doit être un nombre entier";
  MESSAGE_MONTANT_0 = "Ce montant ne peut être égal à 0";
  MESSAGE_MONTANT_JOURNALIER_ASS = "Ce montant doit être compris en 1 et 50";
  MESSAGE_NBR_HEURE_HEBDO_TRAVAILLE = "La valeur renseignée ne peut excéder 48, qui est la durée maximale de travail effectif sur une même semaine.";
  MESSAGE_SELECTION_AU_MOINS_UNE_AIDE = "Veuillez sélectionner au moins une allocation Pôle emploi, CAF ou CPAM (ASS, AAH, RSA, ARE, pension d'invalidité) ou cliquez sur “Aucune ressource”.";
  MESSAGE_SELECTION_AU_MOINS_UN_STATUT_OCCUPATION_LOGEMENT = "Veuillez sélectionner l'option correspondant à votre situation.";
  MESSAGE_SELECTION_DEGRESSIVITE_ARE = "Veuillez indiquer si vous êtes concerné par la dégressivité ou non.";
  MESSAGE_SELECTION_TAUX_DEGRESSIVITE_ARE = "Veuillez sélectionner le taux plein ou le taux réduit pour votre simulation.";
  MESSAGE_SELECTION_AUTRES_SITUATIONS = "Veuillez sélectionner une des situations proposées.";
  MESSAGE_ERREUR_MOIS_SANS_SALAIRE = "Vous avez indiqué avoir travaillé au cours des derniers mois. Veuillez renseigner au moins un salaire supplémentaire.";
  MESSAGE_MONTANTS_0 = "Veuillez renseigner au moins un montant.";
  MESSAGE_DISTANCE_DOMICILE_TRAVAIL_INVALIDE = "La distance renseignée entre votre domicile et votre lieu de travail n'est pas supérieure à 30.";
  MONTANT_ASS_JOURNALIER_MAX = 50;
  MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX = 48;

  public isKeyAuthorizeForDecimal(event): boolean {
    let pattSeparator = /^[\.\,]$/;
    return pattSeparator.test(event.key) || this.isKeyAuthorizeForNumberOnly(event) || this.isExceptKeyAuthorized(event);
  }

  public isKeyAuthorizeForNumberOnly(event): boolean {
    let patt = /^(\d)$/;
    return patt.test(event.key) || this.isExceptKeyAuthorized(event);
  }

  public focusOnFirstElement(): void {
    const firstElements = document.querySelectorAll('.div-title-formulaire');
    let firstElementToFocus = null;
    firstElements.forEach(firstElement => {
      firstElementToFocus = firstElement;
      firstElementToFocus.focus();
    });

  }

  public focusOnFirstInvalidElement(): void {
    const invalidElements = document.querySelectorAll('.ng-invalid');
    if (invalidElements) {
      let invalidElementsToFocus = null;
      invalidElements.forEach(invalidElement => {
        if (!invalidElementsToFocus && invalidElement.localName !== 'form') {
          invalidElementsToFocus = invalidElement;
        }
      });
      if (invalidElementsToFocus) {
        invalidElementsToFocus.focus();
      }
    }
  }

  private isExceptKeyAuthorized(event): boolean {
    return event.key === "Backspace" || event.key === "Tab";
  }
}