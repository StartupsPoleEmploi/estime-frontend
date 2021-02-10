import { ElementRef, Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ControleChampFormulaireService {


  REGEX_MONTANT = "^[0-9]{1,5}((\.|\,)[0-9]{1,2})?$";
  MESSAGE_CHAMP_OBLIGATOIRE = "Ce champ est obligatoire"
  MESSAGE_CHAMP_OBLIGATOIRE_ASTERIX = "Tous les champs marqués d'un astérisque (*) sont obligatoires";
  MESSAGE_CODE_POSTAL_INCORRECT = "Le code postal est incorrect";
  MESSAGE_DATE_ANNEE_OBLIGATOIRE = "L'année est obligatoire";
  MESSAGE_DATE_JOUR_OBLIGATOIRE = "Le jour est obligatoire";
  MESSAGE_DATE_MOIS_OBLIGATOIRE = "Le mois est obligatoire";
  MESSAGE_MONTANT_ERREUR = "Le montant doit être un nombre avec 2 décimales maximum séparées par une virgule (exemple : 1250,49)"
  MESSAGE_MONTANT_0 = "Ce montant ne peut être égal à 0";
  MESSAGE_MONTANT_JOURNALIER_ASS = "Ce montant doit être compris en 1 et 50";
  MESSAGE_NBR_HEURE_HEBDO_TRAVAILLE = "La valeur renseignée ne peut excéder 48, qui est la durée maximale de travail effectif sur une même semaine.";
  MONTANT_ASS_JOURNALIER_MAX = 50;
  MONTANT_NBR_HEURE_HEBDO_TRAVAILLE_MAX = 48;

  public isKeyAuthorizeForDecimal(event): boolean {
    let pattSeparator = /^(\.|\,)$/;
    return pattSeparator.test(event.key) || this.isKeyAuthorizeForNumberOnly(event);
  }

  public isKeyAuthorizeForNumberOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  public focusOnFirstInvalidElement(elementRef: ElementRef): void {
    const invalidElements = elementRef.nativeElement.querySelectorAll('.ng-invalid');
    if(invalidElements[1]) {
      invalidElements[1].focus();
    }
  }



}