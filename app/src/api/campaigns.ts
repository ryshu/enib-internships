import request from '@/utils/request';

import {
  ICampaignEntity,
  InternshipOpts,
  PaginateList,
  IInternshipEntity,
} from '../declarations';

export const defaultCampaignData: ICampaignEntity = {
  name: '',
  description: '',
  category: undefined,

  isPublish: false,
  semester: '',
  maxProposition: 0,

  startAt: 0,
  endAt: 0,
};

export const getCampaigns = () =>
  (request({
    url: '/campaigns',
    method: 'get',
  }) as any) as Promise<ICampaignEntity[]>;

export const getCampaign = (id: number) =>
  (request({
    url: `/campaigns/${id}`,
    method: 'get',
  }) as any) as Promise<ICampaignEntity>;

export const createCampaign = (data: ICampaignEntity) =>
  (request({
    url: '/campaigns',
    method: 'post',
    data,
  }) as any) as Promise<ICampaignEntity>;

export const updateCampaign = (id: number, data: Partial<ICampaignEntity>) =>
  (request({
    url: `/campaigns/${id}`,
    method: 'put',
    data,
  }) as any) as Promise<ICampaignEntity>;

export const deleteCampaign = (id: number) =>
  (request({
    url: `/campaigns/${id}`,
    method: 'delete',
  }) as any) as Promise<void>;

export const getAvailabletInternshipCampaign = (
  id: number,
  params: InternshipOpts
) =>
  (request({
    url: `/campaigns/${id}/availableInternships`,
    method: 'get',
    params,
  }) as any) as Promise<PaginateList<IInternshipEntity>>;

export const getCampaignInternships = (id: number, params: InternshipOpts) =>
  (request({
    url: `/campaigns/${id}/internships`,
    method: 'get',
    params,
  }) as any) as Promise<PaginateList<IInternshipEntity>>;
