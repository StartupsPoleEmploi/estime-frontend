export class Aide {

  id: string;
  nom: string;
  description: string;
  demarcheObtention: string;

  constructor(
    id: string,
    nom: string,
    description: string,
    demarcheObtention: string
  ) {
    this.id = id;
    this.nom = nom;
    this.description = description;
    this.demarcheObtention = demarcheObtention;
  }
}
