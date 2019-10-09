import { AxiosPromise } from 'axios';

import request from '@/utils/request';
import { IStudent } from './types';

export const defaultStudentData: IStudent = {
  firstName: '',
  lastName: '',
  email: '',
  semester: 'S1',
};

export const getStudents = (params: any) =>
  request({
    url: '/students',
    method: 'get',
    params,
  });

export const getStudent = (id: number, params: any) =>
  request({
    url: `/students/${id}`,
    method: 'get',
    params,
  });

export const createStudent = (data: any) =>
  request({
    url: '/students',
    method: 'post',
    data,
  }) as AxiosPromise<IStudent>;

export const updateStudent = (id: number, data: any) =>
  request({
    url: `/students/${id}`,
    method: 'put',
    data,
  }) as AxiosPromise<IStudent>;

export const deleteStudent = (id: number) =>
  request({
    url: `/students/${id}`,
    method: 'delete',
  });
