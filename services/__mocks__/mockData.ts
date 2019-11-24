import { INTERNSHIP_MODE, INTERNSHIP_RESULT } from '../src/internship';

import {
    IBusinessEntity,
    IInternshipEntity,
    IFileEntity,
    IStudentEntity,
    IMentorEntity,
    IMentoringPropositionEntity,
    IInternshipTypeEntity,
    ICampaignEntity,
} from 'src/declarations';

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
        isInternshipAbroad: true,
        state: INTERNSHIP_MODE.PUBLISHED,
        result: INTERNSHIP_RESULT.UNKNOWN,
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

export function defaultMentors() {
    const VALID_MENTOR: IMentorEntity = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@enib.fr',
        role: 'default',
    };
    return VALID_MENTOR;
}

export function defaultCampaigns(): ICampaignEntity {
    return {
        name: 'test',
        description: 'A description to test',
        startAt: 0,
        endAt: 20191012,
        semester: 'S5',
        maxProposition: 2,
        isPublish: true,
        category: {
            label: 'TEST',
        },
    };
}

export function defaultInternshipTypes() {
    const VALID_INTERNSHIP_TYPES: IInternshipTypeEntity = {
        label: 'test',
    };
    return VALID_INTERNSHIP_TYPES;
}

export function getPdfSampleDir() {
    return `${__dirname}/sample.pdf`;
}
