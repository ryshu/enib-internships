import request from '@/utils/request';

import { AxiosPromise } from 'axios';
import { IMentoringPropositionEntity } from '../declarations';

export const defaultMentoringPropositionData: IMentoringPropositionEntity = {
  comment: '',
};

export const getMentoringPropositions = (params?: any) =>
  request({
    url: '/mentoringPropositions',
    method: 'get',
    params,
  });

export const getMentoringProposition = (id: number, params: any) =>
  request({
    url: `/mentoringPropositions/${id}`,
    method: 'get',
    params,
  });

export const createMentoringProposition = (data: any) =>
  request({
    url: '/mentoringPropositions',
    method: 'post',
    data,
  });

export const updateMentoringProposition = (id: number, data: any) =>
  request({
    url: `/mentoringPropositions/${id}`,
    method: 'put',
    data,
  });

export const deleteMentoringProposition = (id: number) =>
  request({
    url: `//mentoringPropositions/${id}`,
    method: 'delete',
  });

export const getMentoringPropositionsbyCampaign = (id: number, params: any) =>
request({
  url: `/campaigns/${id}/mentoringPropositions`,
  method: 'get',
  params,
});
