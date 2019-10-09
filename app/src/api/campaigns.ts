import request from '@/utils/request';

import { AxiosPromise } from 'axios';
import { ICampaigns } from './types';

export const defaultCampaignData: ICampaigns = {
  name: '',
  startAt: 1,
  endAt: 1,
  semester: '',
  maxProposition: 1,
};

export const getCampaigns = (params: any) =>
  request({
    url: '/campaigns',
    method: 'get',
    params,
  });

export const getCampaign = (id: number, params: any) =>
  request({
    url: `/campaigns/${id}`,
    method: 'get',
    params,
  });

export const createCampaign = (data: any) =>
  request({
    url: '/campaigns',
    method: 'post',
    data,
  }) as AxiosPromise<ICampaigns>;

export const updateCampaign = (id: number, data: any) =>
  request({
    url: `/campaigns/${id}`,
    method: 'put',
    data,
  });

export const deleteCampaign = (id: number) =>
  request({
    url: `/campaigns/${id}`,
    method: 'delete',
  });
