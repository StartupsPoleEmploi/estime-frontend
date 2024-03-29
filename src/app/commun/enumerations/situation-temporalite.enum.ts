export enum SituationTemporaliteEnum {
    // AM & AGEPI
    AIDE_MOBILITE = "Vous bénéficiez de l'aide à la mobilité le premier mois",
    AGEPI = "Vous bénéficiez de l'AGEPI le premier mois",
    AGEPI_AIDE_MOBILITE = "Vous bénéficiez de l'aide à la mobilité et de l'AGEPI le premier mois",
    // RSA
    RSA = "Vous cumulez le RSA avec votre salaire jusqu'à votre prochaine déclaration trimestrielle",
    FIN_RSA = "Vous n'êtes plus éligible au RSA",
    RSA_RECALCUL = "Le montant du RSA est recalculé suite à votre déclaration trimestrielle",
    FIN_RSA_PRIME_ACTIVITE = "Vous n'êtes plus éligible au RSA, la prime d'activité complète vos revenus",
    RSA_RECALCUL_PRIME_ACTIVITE = "Le montant du RSA est recalculé suite à votre déclaration trimestrielle et la prime d'activité complète vos revenus",
    // ARE
    RELIQUAT_ARE = "Vous continuez de percevoir votre allocation d'Aide au Retour à l'Emploi le premier mois",
    NON_ELIGIBLE_COMPLEMENT_ARE = "Vous n'êtes pas éligible au complément ARE",
    COMPLEMENT_ARE = "Vous percevez un complément ARE en plus de votre salaire",
    FIN_COMPLEMENT_ARE = "Votre droit ARE est épuisé. Renseignez-vous sur le rechargement des droits.",
    // AAH
    AAH_PARTIEL = "Le montant de votre AAH est réduit car vous avez cumulé 6 mois de salaire",
    FIN_AAH = "Vous n'êtes plus éligible à l'AAH",
    AAH = "Vous cumulez votre AAH avec votre salaire les 6 premiers mois de votre activité",
    // ASS
    ASS_MAINTIEN = "Vous continuez à percevoir votre ASS le premier mois avec votre nouveau salaire",
    ASS_SANS_CUMUL = "Vous percevez l'ASS avec votre salaire pendant 3 mois encore",
    ASS_1_MOIS_CUMUL = "Vous percevez l'ASS avec votre salaire pendant 2 mois encore",
    ASS_2_MOIS_CUMUL = "Vous percevez l'ASS avec votre salaire pendant 1 mois encore",
    FIN_ASS = "Vous ne percevez plus l'ASS car le droit au cumul avec votre salaire est interrompu",
    ASS_BENEFICIAIRE_ACRE = "Vous pouvez cumuler votre ASS avec les revenus de votre activité non salariée pendant 12 mois à compter du mois suivant la date de création ou de reprise de l’entreprise",
    FIN_ASS_BENEFICIAIRE_ACRE = "Vous ne percevez plus l'ASS car le droit au cumul avec votre salaire est interrompu",
    // AL
    AL_CHANGEMENT_SITUATION = "Votre aide au logement est recalculée suite à votre changement de situation",
    AL_DECLA_TRI = "Votre aide au logement est recalculée suite à votre déclaration trimestrielle",
    FIN_AL = "Vous n'êtes plus éligible à l'aide au logement",
    ELIGIBLE_AL = "Vous êtes éligible à l'aide au logement",
    // PPA
    PRIME_ACTIVITE = "Vous êtes éligible à la prime d'activité",
    PRIME_ACTIVITE_RECALCUL = "Le montant de votre prime d'activité est recalculé",
    PRIME_ACTIVITE_ANTICIPE = "Il vous est conseillé d'effectuer votre demande de prime d'activité au cours du mois ",
    // SALAIRE
    SALAIRE = "Votre nouveau salaire est pris en compte dans la simulation pour la durée du contrat",
    // PI
    PENSION_INVALIDITE_CUMUL = "Vous cumulez votre pension d'invalidité avec votre salaire les 6 premiers mois de votre reprise d'emploi"
}