export function defaultBusiness() {
    const VALID_BUSINESS: IBusinessEntity = {
        name: 'test',
        country: 'France',
        city: 'Brest',
        postalCode: '29200',
        address: 'TEST',
    };
    return VALID_BUSINESS;
}

export function defaultFiles() {
    const VALID_FILE: IFileEntity = {
        name: 'fichier',
        size: 150,
        type: 'john.doe@enib.fr',
        path: 'S10',
    };
    return VALID_FILE;
}

export function defaultInternships() {
    const VALID_INTERNSHIP: IInternshipEntity = {
        subject: 'test',
        description: 'Stage',
        country: 'France',
        city: 'Brest',
        postalCode: '29280',
        address: 'TEST',
        isLanguageCourse: true,
        isValidated: false,
    };
    return VALID_INTERNSHIP;
}

export function defaultMentoringPropositions() {
    const VALID_MENTORING_PROPOSITION: IMentoringPropositionEntity = {
        comment: 'test',
    };
    return VALID_MENTORING_PROPOSITION;
}

export function defaultStudents() {
    const VALID_STUDENT: IStudentEntity = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@enib.fr',
        semester: 'S10',
    };
    return VALID_STUDENT;
}

export function defaultInternshipTypes() {
    const VALID_INTERNSHIP_TYPES: IInternshipTypeEntity = {
        label: 'test',
    };
    return VALID_INTERNSHIP_TYPES;
}
