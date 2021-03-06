export default {
  dialog: { title: { create: 'Créer', edit: 'Modifier', import: 'Importer' } },
  export: {
    additional: 'Additionelle',
    address: 'Adresse',
    businesses: { fileName: 'entreprises' },
    city: 'Ville',
    country: 'Pays',
    description: 'Description',
    id: 'ID',
    internships: {
      fileName: 'stages',
      isInternshipAbroad: "A l'étranger ?",
      isValidated: 'Validé ?',
    },
    mentors: { fileName: 'professeurs' },
    students: { fileName: 'etudiants' },
    name: 'Nom',
    postalCode: 'Code postal',
    subject: 'Sujet',
  },
  form: {
    businesses: {
      address: { required: "L'adresse de l'entreprise est requise" },
      city: { required: "La ville de l'entreprise est requise" },
      country: { required: "Le pays de l'entreprise est requis" },
      name: { required: "Le nom de l'entreprise est requis" },
      postalCode: { required: "Le code postal de l'entreprise est requis" },
    },
    internships: {
      subject: { required: 'Le sujet du stage est requis' },
      description: { required: 'La description du stage est requise' },
      offer: { required: 'La présentation du stage est requise' },
      country: { required: 'Le pays du stage est requis' },
      category: { required: 'Le type du stage est requis' },
      city: { required: 'La ville du stage est requise' },
      postalCode: { required: 'Le code postal du stage est requis' },
      address: { required: "L'adresse du stage est requise" },
    },
    campaigns: {
      name: { required: 'Le nom de la campagne est requis' },
      description: { required: 'La description de la campagne est requise' },
      category: { required: 'Le type du stage est requis' },
      date: {
        required: 'La date du stage est requise',
        start_to_early: "La date de publication doit être après aujourd'hui",
        end_to_early:
          "La date de fin de la campagne doit être après aujourd'hui",
      },
    },
    firstConnexion: {
      lastName: { required: "Le nom de l'étudiant est requis" },
      firstName: { required: "Le prénom de l'étudiant est requis" },
    },
  },
  navbar: {
    dashboard: 'Tableau de bord',
    logOut: 'Deconnexion',
    profile: 'Profile',
    size: 'Taille global',
    theme: 'Thème',
  },
  notify: {
    businesses: {
      create: {
        msg: "L'entreprise a bien été créée",
        title: "Création d'une entreprise",
      },
      delete: {
        msg: "L'entreprise a bien été supprimée",
        title: "Suppression d'une entreprise",
      },
      update: {
        msg: "L'entreprise a bien été modifiée",
        title: "Modification d'une campagne",
      },
    },
    campaigns: {
      create: {
        msg: 'La campagne a bien été créée',
        title: "Création d'une campagne",
      },
      delete: {
        msg: 'La campagne a bien été supprimée',
        title: "Suppression d'une campagne",
      },
      update: {
        msg: 'La campagne a bien été modifiée',
        title: "Modification d'une campagne",
      },
    },
    internships: {
      create: {
        msg: 'Le stage a bien été créé',
        title: "Création d'un stage",
      },
      delete: {
        msg: 'Le stage a bien été supprimé',
        title: "Suppression d'un stage",
      },
      update: {
        msg: 'Le stage a bien été modifié',
        title: "Modification d'un stage",
      },
      publish: {
        msg: 'Le stage a bien été publié',
        title: "Publication d'un stage",
      },
      unpublish: {
        msg: 'Le stage a bien été retiré des stages publiés',
        title: "Dépublication d'un stage",
      },
    },
    mentors: {
      create: {
        msg: 'Le professeur a bien été créé',
        title: "Création d'un professeur",
      },
      delete: {
        msg: 'Le professeur a bien été supprimé',
        title: "Suppression d'un professeur",
      },
      update: {
        msg: 'Le professeur a bien été modifié',
        title: "Modification d'un professeur",
      },
      import: {
        msg: 'Le professeur a bien été ajouté à la campagne',
        title: "Importation d'un professeur",
      },
    },
    mentorPropositions: {
      create: {
        msg: 'La proposition a bien été créée',
        title: "Création d'une proposition",
      },
      delete: {
        msg: 'La proposition a bien été supprimée',
        title: "Suppression d'une proposition",
      },
      update: {
        msg: 'La proposition a bien été modifiée',
        title: "Modification d'une proposition",
      },
      attributed: {
        msg: 'Le stage a été attribué au tuteur',
        title: 'Proposition validée',
      },
    },
    students: {
      create: {
        msg: "L'étudiant a bien été créé",
        title: "Création d'un étudiant",
      },
      delete: {
        msg: "L'étudiant a bien été supprimé",
        title: "Suppression d'un étudiant",
      },
      update: {
        msg: "L'étudiant a bien été modifié",
        title: "Modification d'un étudiant",
      },
      attribute: {
        msg: "L'étudiant a bien été attribué",
        title: "Attributation d'une offre",
      },
    },
  },
  route: {
    businesses: 'Entreprises',
    dashboard: 'Tableau de bord',
    internships: {
      title: 'Stages',
      list: 'Liste des stages',
      waiting: 'Stages en attente',
      published: 'Stages publiés',
      mentored: 'Mes stages',
      favourites: 'Favoris',
      suggest: 'Proposer un stage',
      new: 'Ajouter un stage',
    },
    campaigns: {
      title: 'Campagnes',
      dashboard: 'Tableau de bord',
      internships: 'Liste des stages',
      students: 'Etudiants',
      mentors: 'Professeurs',
      propositions: 'Propositions',
      settings: 'Paramètre',
      new: 'Nouvelle campagne',
      modify: 'Modifier les paramètres de la campagne',
    },
    page404: '404',
    profile: 'Profile',
    users: {
      first: 'Bienvenue sur le gestionnaire des stages',
      title: 'Utilisateurs',
      students: 'Etudiants',
      mentors: 'Professeurs',
    },
    firstConnexion: {
      title: 'Première connexion',
      description:
        "Il s'agit de votre première connexion, veuillez renseigner les champs suivants",
      warning:
        'Ces informations seront utilisés pour vos documents administratifs ',
      firstName: 'Prénom',
      lastName: 'Nom',
      semester: 'Semestre',
    },
  },
  status: { no: 'Non', yes: 'Oui' },
  table: {
    actions: 'Actions',
    add: 'Ajouter',
    reset: 'Réinitialiser',
    businesses: {
      additional: 'Informations complémentaire',
      address: 'Adresse',
      city: 'Ville',
      country: 'Pays',
      name: "Nom de l'entreprise",
      postalCode: 'Code postal',
      withInternships: "N'afficher que les enteprises avec stages",
    },
    campaigns: {
      name: 'Nom de la campagne',
      description: 'Descriptif de la campagne',

      endAt: 'Fin',
      maxProposition: 'Nbr max de propositions',
      semester: 'Semestre',
      category: 'Type de stage',

      startAt: 'Début',
      date: 'Periode de publication',
      isPublish: 'Publier la campagne',
      isVisible: 'Campagne visible',
    },
    cancel: 'Annuler',
    confirm: 'Confirmer',
    validate: 'Valider',
    create: 'Créer',
    date: 'Date',
    delete: 'Supprimer',
    edit: 'Modifier',
    export: 'Exporter',
    archive: 'Archiver',
    detail: 'Détail',
    save: 'Sauvegarder',
    id: 'ID',
    internships: {
      additional: 'Informations complémentaire',
      additionalbis: 'Complément',
      address: 'Addresse',
      city: 'Ville',
      country: 'Pays',
      category: 'Type de stage',
      description: 'Description',
      isInternshipAbroad: "Stage à l'étranger ?",
      isValidated: 'Validé',
      isProposition: 'Proposition',
      postalCode: 'Code postal',
      subject: 'Sujets',
      publishAt: 'Date de publication',
      result: 'Résultat',
      date: 'Dates de stage',
      student: 'Etudiant',
      isPublish: 'Publié ?',
    },
    mentors: {
      firstName: 'Prénom',
      lastName: 'Nom',
      fullName: 'Nom',
      email: 'Email',
    },
    mentoringProposition: {
      title: 'Postuler',
      comment: 'Ajouter un commentaire',
      student: 'Etudiant',
      internship: 'Sujet de Stage',
      business: 'Entreprise',
      mentor: 'Tuteur',
      country: 'Pays',
    },
    publish: 'Publier',
    search: 'Recherche',
    status: 'Status',
    students: {
      student: 'Étudiant(e)',
      email: 'Adresse mail',
      firstName: 'Prénom',
      lastName: 'Nom',
      fullName: 'Nom',
      semester: 'Semester',
    },
    checkbox: {
      isAbroad: "Seulement ceux à l'étrangers",
      isValidated: 'Seulement ceux validés',
    },
    filter: {
      countries: 'Filtre par pays',
      types: 'Filtre par type',
    },
    title: 'Titre',
    update: 'Modifier',
  },
  title: 'Gestionnaire de stage',
  suggest: {
    title: "Proposition d'une offre de stage",
    subTitle: {
      description: "Description de l'offre de stage",
      location: 'Adresse du stage',
      settings: 'Paramètres du stage',
    },
    files: {
      title: "Fichier liés à l'offre de stage",
      offer: 'Description offre',
      business: 'Description entreprise',
    },
    checkbox: {
      abroad: "Indique si le stage est réalisé à l'étranger",
      proposition:
        "L'offre est une proposition ? Elle devra donc être validée avant d'être publier par un administrateur.",
      publish:
        "Indiquer si l'offre est publiée pour les professeurs et les étudiants",
    },
    placeholder: {
      subject: 'Entrer le nom de votre offre de stage',
      description: "Saisir l'offre de stage ici ",
      city: 'e.g: Plouner',
      postalCode: 'e.g: 23840',
      address: 'e.g: 1 Rue de la Tour',
      additonal: 'e.g: APT 3910',
      category: 'Selectionner le type de stage',
    },
    progress: {
      title: 'Publication de la proposition de stage',
      step_1: "Création de l'offre",
      step_2: "Téléversement de l'offre",
      step_3: "Téléversement de la présentation de l'entreprise",
      success: 'Publication terminée avec succès',
    },
  },
  input: {
    file: { placeholder: 'Selectionner un fichier', btn: 'Parcourir' },
    select: { default: 'Selectioner la valeur' },
  },
  action: { close: 'Fermer' },
  campaigns: {
    placeholder: {
      name: 'Entrer le nom de la campagne',
      description: 'Entrer une description de campagne',
      category: 'Selectioner le type de stage lié à la campagne',
    },

    checkbox: {
      isPublish: 'Publier la campagne immédiatement',
    },

    progress: {
      title: "Publication d'une campagne",
      processing: 'En cours',
      step_1: 'Initialization de la campagne',
      error: 'Erreur durant la création de la campagne',
      success: 'La campagne a bien été publier',
    },
  },
  firstConnexion: {
    placeholder: {
      firstName: 'Entrer votre prénom',
      lastName: 'Entrer votre nom',
      email: 'Saisissez votre adresse mail',
      semester: 'Veuillez saisir votre semestre actuel',
    },
  },
  propositions: {
    placeholder: {
      add: "Accepter l'offre",
      update: "Editer l'offre",
      remove: "Supprimer l'offre",
    },
  },
  internships: {
    placeholder: {
      publish: "Publier l'offre",
      unpublish: "Dépublier l'offre",
      update: "Editer l'offre",
      remove: "Supprimer l'offre",
      attribute: "Attribuer l'offre",
    },
  },
  students: {
    placeholder: {
      update: "Editer l'étudiant",
      remove: "Supprimer l'étudiant de cette campaign",
      includeStudent: "Nom de l'étudiant pour l'attribution",
    },
  },
  mentors: {
    placeholder: {
      includeMentor: "Entrer une partie du nom de l'utilsateur pour le trouver",
    },
  },
  mentoringProposition: {
    placeholder: {
      create: 'Postuler',
      validate: 'Valider le tuteur pour ce stage',
      delete: 'Supprimer la proposition de tutorat',
    },
  },
};
