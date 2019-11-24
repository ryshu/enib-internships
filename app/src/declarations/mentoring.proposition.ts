import { IMentorEntity } from './mentor';
import { IInternshipEntity } from './internship';
import { ICampaignEntity } from './campaign';

/** @interface PropositionsOpts Interface of all availables filters for propositions list */
export interface PropositionsOpts {
  /** @property {number} internshipId Filter propositions by internship */
  internshipId?: number;

  /** @property {number} campaignId Filter propositions by campaign */
  campaignId?: number;

  /** @property {number} mentorId Filter propositions by mentor */
  mentorId?: number;
}

export declare interface IMentoringPropositionEntity {
  id?: number;

  comment: string;

  mentor?: IMentorEntity;
  internship?: IInternshipEntity;
  campaign?: ICampaignEntity;

  createdAt?: Date;
  updatedAt?: Date;
}
