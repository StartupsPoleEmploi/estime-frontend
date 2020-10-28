export class AideSociale {

  code: string;
  nom: string;
  description: string;
  demarcheObtention: string;
  montant: number;

  constructor(
    code: string,
    nom: string,
    description: string,
    demarcheObtention: string,
    montant: number
  ) {
    this.code = code;
    this.nom = nom;
    this.description = description;
    this.demarcheObtention = demarcheObtention;
    this.montant = montant;
  }
}
