import request from '@/utils/request';

import { IBusinessEntity, BusinessOpts, PaginateList } from '../declarations';

export const defaultBusinessData: IBusinessEntity = {
  name: '',
  country: 'France',
  city: '',
  postalCode: '',
  address: '',
  additional: '',
};

export const getBusinesses = (params: BusinessOpts) =>
  (request({
    url: '/businesses',
    method: 'get',
    params,
  }) as any) as Promise<PaginateList<IBusinessEntity>>;

export const getBusiness = (id: number) =>
  (request({
    url: `/businesses/${id}`,
    method: 'get',
  }) as any) as Promise<IBusinessEntity>;

export const createBusiness = (data: IBusinessEntity) =>
  (request({
    url: '/businesses',
    method: 'post',
    data,
  }) as any) as Promise<IBusinessEntity>;

export const updateBusiness = (id: number, data: Partial<IBusinessEntity>) =>
  (request({
    url: `/businesses/${id}`,
    method: 'put',
    data,
  }) as any) as Promise<IBusinessEntity>;

export const deleteBusiness = (id: number) =>
  (request({
    url: `/businesses/${id}`,
    method: 'delete',
  }) as any) as Promise<void>;
