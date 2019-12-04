import request from '@/utils/request';

import {
  PaginateList,
  IMentoringPropositionEntity,
  PropositionsOpts,
} from '../declarations';

export const defaultMentoringPropositionData: IMentoringPropositionEntity = {
  comment: '',
};

export const getMentoringPropositions = (params: PropositionsOpts) =>
  (request({
    url: '/mentoringPropositions',
    method: 'get',
    params,
  }) as any) as Promise<PaginateList<IMentoringPropositionEntity>>;

export const getMentoringProposition = (id: number) =>
  (request({
    url: `/mentoringPropositions/${id}`,
    method: 'get',
  }) as any) as Promise<IMentoringPropositionEntity>;

export const createMentoringProposition = (data: IMentoringPropositionEntity) =>
  (request({
    url: '/mentoringPropositions',
    method: 'post',
    data,
  }) as any) as Promise<IMentoringPropositionEntity>;

export const updateMentoringProposition = (
  id: number,
  data: Partial<IMentoringPropositionEntity>
) =>
  (request({
    url: `/mentoringPropositions/${id}`,
    method: 'put',
    data,
  }) as any) as Promise<IMentoringPropositionEntity>;

export const deleteMentoringProposition = (id: number) =>
  (request({
    url: `/mentoringPropositions/${id}`,
    method: 'delete',
  }) as any) as Promise<void>;

export const linkToMentor = (propositionId: number, mentorId: number) =>
  (request({
    url: `/mentoringPropositions/${propositionId}/files/${mentorId}/link`,
    method: 'post',
  }) as any) as Promise<IMentoringPropositionEntity>;

export const linkToCampaign = (propositionId: number, campaignId: number) =>
  (request({
    url: `/mentoringPropositions/${propositionId}/files/${campaignId}/link`,
    method: 'post',
  }) as any) as Promise<IMentoringPropositionEntity>;

export const linkToInternship = (propositionId: number, internshipId: number) =>
  (request({
    url: `/mentoringPropositions/${propositionId}/files/${internshipId}/link`,
    method: 'post',
  }) as any) as Promise<IMentoringPropositionEntity>;

export const getMentoringPropositionsbyCampaign = (id: number, params: any) =>
  (request({
    url: `/campaigns/${id}/mentoringPropositions`,
    method: 'get',
    params,
  }) as any) as Promise<PaginateList<IMentoringPropositionEntity>>;
