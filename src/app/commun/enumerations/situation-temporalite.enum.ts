export enum SituationTemporaliteEnum {

    AIDE_MOBILITE = "Vous bénéficiez de l'aide à la mobilité le premier mois",
    AGEPI = "Vous bénéficiez de l'AGEPI le premier mois",
    AGEPI_AIDE_MOBILITE = "Vous bénéficiez de l'aide à la mobilité et de l'AGEPI le premier mois",
    RSA = "Vous cumulez le RSA avec votre salaire jusqu'à votre prochaine déclaration trimestrielle",
    FIN_RSA = "Vous n'êtes plus éligible au RSA",
    FIN_RSA_PRIME_ACTIVITE = "Vous n'êtes plus éligible au RSA, la prime d'activité complète vos revenus",
    RSA_RECALCUL_PRIME_ACTIVITE = "Le montant du RSA est recalculé suite à votre déclaration trimestrielle et la prime d'activité complète vos revenus",
    RSA_RECALCUL = "Le montant du RSA est recalculé suite à votre déclaration trimestrielle",
    COMPLEMENT_ARE = "Vous percevez un complément ARE en plus de votre salaire",
    FIN_COMPLEMENT_ARE = "Vous ne percez plus de complément ARE car vos droits sont épuisés à ce jour",
    COMPLEMENT_ARE_PARTIEL = "Vous percez un complément ARE partiel à hauteur de vos droits restants",
    AAH_PARTIEL = "Le montant de votre AAH est réduit car vous avez cumulé 6 mois de salaire",
    FIN_AAH = "Vous ne percevez plus d'AAH car vos droits sont épuisés à ce jour",
    ASS_SANS_CUMUL = "Vous cumulez l'ASS avec votre salaire pendant 3 mois",
    ASS_1_MOIS_CUMUL = "Vous cumulez l'ASS avec votre salaire pendant 2 mois",
    ASS_2_MOIS_CUMUL = "Vous cumulez l'ASS avec votre salaire pendant 1 mois",
    AL_CHANGEMENT_SITUATION = "Votre aide au logement est recalculée suite à votre changement de situation",
    AL_DECLA_TRI = "Votre aide au logement est recalculée suite à votre déclaration trimestrielle",
    FIN_AL = "Vous n'êtes plus éligible à l'aide au logement",
    PRIME_ACTIVITE = "Vous êtes éligible à la prime d'activité"
}