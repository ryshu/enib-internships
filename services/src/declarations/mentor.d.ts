import { ICampaignEntity } from './campaign';
import { IInternshipEntity } from './internship';
import { IMentoringPropositionEntity } from './mentoring.proposition';

declare type MentorRole = 'default' | 'admin';

declare interface IMentorEntity {
    id?: number;

    firstName: string;
    lastName: string;
    fullName: string;

    email: string;
    role: MentorRole;

    campaigns?: ICampaignEntity[];
    propositions?: IMentoringPropositionEntity[];
    internships?: IInternshipEntity[];

    createdAt?: Date;
    updatedAt?: Date;
}
