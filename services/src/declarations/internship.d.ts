import { IFileEntity } from './file';
import { IStudentEntity } from './student';
import { IMentorEntity } from './mentor';
import { IMentoringPropositionEntity } from './mentoring.proposition';
import { ICampaignEntity } from './campaign';
import { IBusinessEntity } from './business';
import { IInternshipTypeEntity } from './internship.type';

import { INTERNSHIP_MODE, INTERNSHIP_RESULT } from '../internship';

declare interface IInternshipEntity {
    id?: number;

    // Data
    subject: string;
    description: string;

    // Localisation
    country: string;
    city: string;
    postalCode?: string;
    address?: string;
    additional?: string;

    // State
    isInternshipAbroad: boolean;

    state: INTERNSHIP_MODE;
    result: INTERNSHIP_RESULT;

    // Date
    publishAt?: number;
    startAt?: number;
    endAt?: number;

    // Relation
    files?: IFileEntity[];
    student?: IStudentEntity;
    mentor?: IMentorEntity;
    propositions?: IMentoringPropositionEntity[];
    validatedCampaign?: ICampaignEntity;
    availableCampaign?: ICampaignEntity;
    business?: IBusinessEntity;
    category?: IInternshipTypeEntity;

    createdAt?: Date;
    updatedAt?: Date;
}
