export class DateDecomposee {
  annee: string;
  isJourInvalide: boolean;
  isMoisInvalide: boolean;
  isAnneeInvalide: boolean;
  isDateSuperieurDateJour: boolean;
  jour: string;
  libelleTypeDate: string;
  libelleAriaLabel: string;
  messageErreurFormatJour: string;
  messageErreurFormatMois: string;
  messageErreurFormatAnnee: string;
  messageErreurSuperieurDateJour = 'La date ne peut pas être supérieure à la date du jour';
  mois: string;
}