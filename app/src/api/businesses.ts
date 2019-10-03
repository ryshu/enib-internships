import request from '@/utils/request';

import { AxiosPromise } from 'axios';
import { IBusiness } from './types';

export const defaultBusinessData: IBusiness = {
  name: '',
  country: 'France',
  city: '',
  postalCode: '',
  address: '',
  additional: '',
};

export const getBusinesses = (params: any) =>
  request({
    url: '/businesses',
    method: 'get',
    params,
  });

export const getBusiness = (id: number, params: any) =>
  request({
    url: `/businesses/${id}`,
    method: 'get',
    params,
  });

export const createBusiness = (data: any) =>
  request({
    url: '/businesses',
    method: 'post',
    data,
  }) as AxiosPromise<IBusiness>;

export const updateBusiness = (id: number, data: any) =>
  request({
    url: `/businesses/${id}`,
    method: 'put',
    data,
  });

export const deleteBusiness = (id: number) =>
  request({
    url: `/businesses/${id}`,
    method: 'delete',
  });
