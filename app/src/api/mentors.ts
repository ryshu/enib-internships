import request from '@/utils/request';
import { IMentor } from './types';

export const defaultMentorData: IMentor = {
  firstName: '',
  lastName: '',
  email: '',
};

export const getMentors = (params: any) =>
  request({
    url: '/mentors',
    method: 'get',
    params,
  });

export const getMentor = (id: number, params: any) =>
  request({
    url: `/mentors/${id}`,
    method: 'get',
    params,
  });

export const createMentor = (data: any) =>
  request({
    url: '/mentors',
    method: 'post',
    data,
  });

export const updateMentor = (id: number, data: any) =>
  request({
    url: `/mentors/${id}`,
    method: 'put',
    data,
  });

export const deleteMentor = (id: number) =>
  request({
    url: `/mentors/${id}`,
    method: 'delete',
  });
