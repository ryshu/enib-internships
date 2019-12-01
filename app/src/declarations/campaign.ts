import { IInternshipEntity } from './internship';
import { IMentoringPropositionEntity } from './mentoring.proposition';
import { IMentorEntity } from './mentor';
import { IInternshipTypeEntity } from './internship.type';

export declare interface ICampaignEntity {
  id?: number;

  name: string;
  description: string;
  category?: IInternshipTypeEntity;

  semester: string;
  maxProposition: number;

  isPublish: boolean;

  startAt: number;
  endAt: number;

  propositions?: IMentoringPropositionEntity[];
  availableInternships?: IInternshipEntity[];
  validatedInternships?: IInternshipEntity[];
  mentors?: IMentorEntity[];

  createdAt?: Date;
  updatedAt?: Date;
}
