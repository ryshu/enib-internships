import request from '@/utils/request';

import { IMentorEntity, PaginateList, MentorOpts } from '../declarations';

export const defaultMentorData: IMentorEntity = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'default',
};

export const getMentors = (params: MentorOpts) =>
  (request({
    url: '/mentors',
    method: 'get',
    params,
  }) as any) as Promise<PaginateList<IMentorEntity>>;

export const getMentorsByCampaign = (id: number, params: any) =>
  request({
    url: `/campaigns/${id}/mentors`,
    method: 'get',
    params,
  });

export const getMentor = (id: number, params: any) =>
  (request({
    url: `/mentors/${id}`,
    method: 'get',
  }) as any) as Promise<IMentorEntity>;

export const createMentor = (data: IMentorEntity) =>
  (request({
    url: '/mentors',
    method: 'post',
    data,
  }) as any) as Promise<IMentorEntity>;

export const updateMentor = (id: number, data: Partial<IMentorEntity>) =>
  (request({
    url: `/mentors/${id}`,
    method: 'put',
    data,
  }) as any) as Promise<IMentorEntity>;

export const deleteMentor = (id: number) =>
  (request({
    url: `/mentors/${id}`,
    method: 'delete',
  }) as any) as Promise<void>;

export const linkMentorProposition = (
  mentorID: number,
  mentoringPropositionId: number
) =>
  (request({
    url: `/mentors/${mentorID}/propositions/${mentoringPropositionId}/link`,
    method: 'post',
  }) as any) as Promise<IMentorEntity>;
