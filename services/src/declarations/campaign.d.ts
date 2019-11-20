import { IInternshipEntity } from './internship';
import { IMentoringPropositionEntity } from './mentoring.proposition';
import { IMentorEntity } from './mentor';
import { IInternshipTypeEntity } from './internship.type';

declare interface ICampaignEntity {
    id?: number;

    name: string;
    description: string;

    semester: string;
    maxProposition: number;

    isPublish: boolean;

    startAt: number;
    endAt: number;

    propositions?: IMentoringPropositionEntity[];
    availableInternships?: IInternshipEntity[];
    validatedInternships?: IInternshipEntity[];
    mentors?: IMentorEntity[];
    category: IInternshipTypeEntity;

    createdAt?: Date;
    updatedAt?: Date;
}
