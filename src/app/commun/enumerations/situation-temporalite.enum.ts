export enum SituationTemporaliteEnum {
    // AM & AGEPI
    AIDE_MOBILITE = "Vous bénéficiez de l'aide à la mobilité le premier mois",
    AGEPI = "Vous bénéficiez de l'AGEPI le premier mois",
    AGEPI_AIDE_MOBILITE = "Vous bénéficiez de l'aide à la mobilité et de l'AGEPI le premier mois",
    // RSA
    RSA = "Vous cumulez le RSA avec votre salaire jusqu'à votre prochaine déclaration trimestrielle",
    FIN_RSA = "Vous n'êtes plus éligible au RSA",
    FIN_RSA_PRIME_ACTIVITE = "Vous n'êtes plus éligible au RSA, la prime d'activité complète vos revenus",
    RSA_RECALCUL_PRIME_ACTIVITE = "Le montant du RSA est recalculé suite à votre déclaration trimestrielle et la prime d'activité complète vos revenus",
    RSA_RECALCUL = "Le montant du RSA est recalculé suite à votre déclaration trimestrielle",
    // ARE
    RELIQUAT_ARE = "Vous continuez à percevoir votre Allocation de Retour à l'Emploi",
    COMPLEMENT_ARE = "Vous percevez un complément ARE en plus de votre salaire",
    NON_ELIGIBLE_COMPLEMENT_ARE = "Vous n'êtes pas éligible au complément ARE",
    FIN_COMPLEMENT_ARE = "Vous ne percevez plus de complément ARE car vos droits sont épuisés à ce jour",
    // AAH
    AAH = "Vous cumulez votre AAH avec votre salaire pour les 6 premiers mois de votre activité",
    AAH_PARTIEL = "Le montant de votre AAH est réduit car vous avez cumulé 6 mois de salaire",
    FIN_AAH = "Vous ne percevez plus d'AAH car vos droits sont épuisés à ce jour",
    // ASS
    ASS_BENEFICIAIRE_ACRE = "Vous pouvez cumuler votre ASS avec les revenus de votre activité non salariée pendant 12 mois à compter de la date de création ou de reprise de l’entreprise",
    ASS_MAINTIEN = "Vous continuez à percevoir votre ASS le premier mois avec votre nouveau salaire",
    ASS_SANS_CUMUL = "Vous percevez l'ASS avec votre salaire pendant 3 mois encore",
    ASS_1_MOIS_CUMUL = "Vous percevez l'ASS avec votre salaire pendant 2 mois encore",
    ASS_2_MOIS_CUMUL = "Vous percevez l'ASS avec votre salaire pendant 1 mois encore",
    FIN_ASS = "Vous ne percevez plus l'ASS car le droit au cumul avec votre salaire est interrompu",
    FIN_ASS_BENEFICIAIRE_ACRE = "Vous ne percevez plus l'ASS car le droit au cumul avec votre salaire est interrompu",
    PRIME_ACTIVITE_ANTICIPE = "Votre demande de prime d'activité sera à effectuer au cours du mois ",
    // AL
    ELIGIBLE_AL = "Vous êtes éligible à l'aide au logement",
    AL_CHANGEMENT_SITUATION = "Votre aide au logement est recalculée suite à votre changement de situation",
    AL_DECLA_TRI = "Votre aide au logement est recalculée suite à votre déclaration trimestrielle",
    FIN_AL = "Vous n'êtes plus éligible à l'aide au logement",
    // PPA
    PRIME_ACTIVITE = "Vous êtes éligible à la prime d'activité",
    PRIME_ACTIVITE_RECALCUL = "Le montant de votre prime d'activité est recalculé",
    // SALALIRE
    SALAIRE = "Votre nouveau salaire est pris en compte dans la simulation pour la durée du contrat"
}