import request from '@/utils/request';

import {
  IInternshipEntity,
  InternshipOpts,
  ICampaignEntity,
  PaginateList,
  INTERNSHIP_MODE,
  INTERNSHIP_RESULT,
} from '../declarations';

export const defaultInternshipData: IInternshipEntity = {
  subject: '',
  description: '',
  country: 'France',
  city: '',
  postalCode: '',
  address: '',
  additional: '',

  category: { id: undefined, label: '' },

  isInternshipAbroad: false,
  state: INTERNSHIP_MODE.WAITING,
  result: INTERNSHIP_RESULT.UNKNOWN,

  publishAt: undefined,
  startAt: undefined,
  endAt: undefined,
};

export const getInternships = (params: InternshipOpts) =>
  (request({
    url: '/internships',
    method: 'get',
    params,
  }) as any) as Promise<PaginateList<IInternshipEntity>>;

export const getInternship = (id: number) =>
  (request({
    url: `/internships/${id}`,
    method: 'get',
  }) as any) as Promise<IInternshipEntity>;

export const createInternship = (data: IInternshipEntity) =>
  (request({
    url: '/internships',
    method: 'post',
    data,
  }) as any) as Promise<IInternshipEntity>;

export const updateInternship = (
  id: number,
  data: Partial<IInternshipEntity>
) =>
  (request({
    url: `/internships/${id}`,
    method: 'put',
    data,
  }) as any) as Promise<IInternshipEntity>;

export const deleteInternship = (id: number) =>
  (request({
    url: `/internships/${id}`,
    method: 'delete',
  }) as any) as Promise<void>;

export const linkInternshipFile = (internshipID: string, fileID: string) =>
  (request({
    url: `/internships/${internshipID}/files/${fileID}/link`,
    method: 'post',
  }) as any) as Promise<IInternshipEntity>;

export const getAvailableInternshipCampaign = (id: number) =>
  (request({
    url: `/internships/${id}/availableCampaign`,
    method: 'get',
  }) as any) as Promise<ICampaignEntity>;

export const publishInternship = (id: number) =>
  (request({
    url: `/internships/${id}/fsm`,
    method: 'post',
    data: { state: INTERNSHIP_MODE.PUBLISHED },
  }) as any) as Promise<IInternshipEntity>;

export const unpublishInternship = (id: number) =>
  (request({
    url: `/internships/${id}/fsm`,
    method: 'post',
    data: { state: INTERNSHIP_MODE.WAITING },
  }) as any) as Promise<IInternshipEntity>;

export const linkInternshipPropositions = (
  internshipID: number,
  mentoringPropositionId: number
) =>
  (request({
    url: `/internships/${internshipID}/propositions/${mentoringPropositionId}/link`,
    method: 'post',
  }) as any) as Promise<IInternshipEntity>;

export const attributeInternshipToMentor = (id: number, mentorId: number) =>
  (request({
    url: `/internships/${id}/fsm`,
    method: 'post',
    data: { state: INTERNSHIP_MODE.PUBLISHED, mentorId },
  }) as any) as Promise<IInternshipEntity>;
