import { INTERNSHIP_MODE } from '../statistics/base';

import { IFileEntity } from './file';
import { IStudentEntity } from './student';
import { IMentorEntity } from './mentor';
import { IMentoringPropositionEntity } from './mentoring.proposition';
import { ICampaignEntity } from './campaign';
import { IBusinessEntity } from './businness';
import { IInternshipTypeEntity } from './internship.type';

declare interface IInternshipEntity {
    id?: number;

    // Data
    subject: string;
    description: string;

    // Localisation
    country: string;
    city: string;
    postalCode: string;
    address: string;
    additional?: string;

    // State
    isInternshipAbroad: boolean;
    isValidated: boolean;
    isProposition: boolean;
    isPublish: boolean;
    state: INTERNSHIP_MODE;

    // Date
    publishAt: number;
    startAt: number;
    endAt: number;

    // Relation
    files?: IFileEntity[];
    student?: IStudentEntity;
    mentor?: IMentorEntity;
    propositions?: IMentoringPropositionEntity[];
    campaign?: ICampaignEntity;
    business?: IBusinessEntity;
    category?: IInternshipTypeEntity;

    createdAt?: Date;
    updatedAt?: Date;
}
