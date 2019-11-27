import { ICampaignEntity } from './campaign';
import { IInternshipEntity } from './internship';

declare interface IInternshipTypeEntity {
    id?: number;

    label: string;

    campaigns?: ICampaignEntity[];
    internships?: IInternshipEntity[];

    createdAt?: Date;
    updatedAt?: Date;
}
