export class DateDecomposee {
  libelleAriaLabel: string;
  jour: string;
  mois: string;
  annee: string;
  isJourInvalide: boolean;
  isMoisInvalide: boolean;
  isAnneeInvalide: boolean;
  isDateSuperieurDateJour: boolean;
  messageErreurFormatJour: string;
  messageErreurFormatMois: string;
  messageErreurFormatAnnee: string;
  messageErreurSuperieurDateJour = 'La date ne peut pas être supérieure à la date du jour';
}