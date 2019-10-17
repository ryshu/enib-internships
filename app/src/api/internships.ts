import request from '@/utils/request';

import { AxiosPromise } from 'axios';
import { IInternship } from './types';

export const defaultInternshipData: IInternship = {
  subject: '',
  description: 'Stage',
  country: 'France',
  city: '',
  postalCode: '',
  address: '',
  additional: '',
  isInternshipAbroad: false,
  isValidated: false,
};

export const getInternships = (params: any) =>
  request({
    url: '/internships',
    method: 'get',
    params,
  });

export const getInternship = (id: number, params: any) =>
  request({
    url: `/internships/${id}`,
    method: 'get',
    params,
  });

export const createInternship = (data: any) =>
  request({
    url: '/internships',
    method: 'post',
    data,
  }) as AxiosPromise<IInternship>;

export const updateInternship = (id: number, data: any) =>
  request({
    url: `/internships/${id}`,
    method: 'put',
    data,
  });

export const deleteInternship = (id: number) =>
  request({
    url: `/internships/${id}`,
    method: 'delete',
  });
