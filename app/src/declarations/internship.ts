import { IFileEntity } from './file';
import { IStudentEntity } from './student';
import { IMentorEntity } from './mentor';
import { IMentoringPropositionEntity } from './mentoring.proposition';
import { ICampaignEntity } from './campaign';
import { IBusinessEntity } from './business';
import { IInternshipTypeEntity } from './internship.type';

import { INTERNSHIP_MODE, INTERNSHIP_RESULT } from './internship.enum';

export declare interface IInternshipEntity {
  id?: number;

  // Data
  subject: string;
  description: string;

  // Localization
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

/** @interface InternshipOpts Interface of all available filters for internship list */
export interface InternshipOpts {
  page: number;
  limit: number;

  /** @property {string[]} countries List of selected countries to filter */
  countries?: string[];

  /** @property {number[]} types List of internship types identifier */
  types?: number[];

  /** @property {string} name Part of subject to apply filter on subject field (database) */
  subject?: string;

  /** @property {INTERNSHIP_MODE[]} mode Filter internships by mode */
  mode?: INTERNSHIP_MODE[];

  /** @property {boolean} isAbroad Select only foreign internships */
  isAbroad?: boolean;

  /** @property {IStudentEntity[]} student Filter internships by student */
  student?: IStudentEntity[];
}
