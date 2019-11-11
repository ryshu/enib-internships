import request from '@/utils/request';

import { AxiosPromise } from 'axios';
import { IInternship } from './types';

export const defaultInternshipData: IInternship = {
  subject: '',
  description: '',
  country: 'France',
  city: '',
  postalCode: '',
  address: '',
  additional: '',

  category: undefined,

  isInternshipAbroad: false,
  isValidated: false,
  isProposition: false,
  isPublish: false,

  publishAt: undefined,
  startAt: undefined,
  endAt: undefined,
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

export const linkInternshipFile = (internshipID: string, fileID: string) =>
  request({
    url: `/internships/${internshipID}/files/${fileID}/link`,
    method: 'post',
  });
