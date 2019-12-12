import { ICampaignEntity } from './campaign';
import { IInternshipEntity } from './internship';
import { IMentoringPropositionEntity } from './mentoring.proposition';

export declare type MentorRole = 'default' | 'admin';

export declare interface IMentorEntity {
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

/** @interface MentorOpts Interface of all availables filters for mentors list */
export interface MentorOpts {
  page?: number;

  limit?: number;

  /** @property {string} name Filter by mentor name */
  name?: string;

  /** @property {boolean} archived Show only archived propositions */
  archived?: boolean;

  /** @property {string[]} includes Filter to include and populate given associations */
  includes?: string[];
}
