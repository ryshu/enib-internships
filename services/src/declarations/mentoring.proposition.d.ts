import { IMentorEntity } from './mentor';
import { IInternshipEntity } from './internship';
import { ICampaignEntity } from './campaign';

declare interface IMentoringPropositionEntity {
    id?: number;

    comment: string;

    mentor?: IMentorEntity;
    internship?: IInternshipEntity;
    campaign?: ICampaignEntity;

    createdAt?: Date;
    updatedAt?: Date;
}
