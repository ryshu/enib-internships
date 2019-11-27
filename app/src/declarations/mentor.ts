import { ICampaignEntity } from './campaign';
import { IInternshipEntity } from './internship';
import { IMentoringPropositionEntity } from './mentoring.proposition';

export declare type MentorRole = 'default' | 'admin';

export declare interface IMentorEntity {
  id?: number;

  firstName: string;
  lastName: string;
  email: string;
  role: MentorRole;

  campaigns?: ICampaignEntity[];
  propositions?: IMentoringPropositionEntity[];
  internships?: IInternshipEntity[];

  createdAt?: Date;
  updatedAt?: Date;
}

/** @interface MentorOpts Interface of all availables filters for mentors list */
export interface MentorOpts {
  /** @property {number} campaignId Filter list with categoryId */
  campaignId?: number;
}
